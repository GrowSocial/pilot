// TODO multiple search indexes for different search entities (person/product/event) [just use one at a time!]
// TODO capture from user: desired search location
// TODO list result and map result, linked
// TODO search results link to: person; highlight map ref (default); expand details (default)
// TODO autosuggest, rather than autosearch, on paused typing
// TODO pagination, more results than limit, etc.
// TODO initiate search when type into navSearchText and press enter/button
//        nearly there, copies the value over!
// TODO default search filters: radius to cover south florida, search type people
// TODO remember last search options: 
//        radius, town, search entity type person/product/business/etc, search word (if navsearch is blank use last search)
// TODO to simplify vendor search, each product can have vendorLink? and vendorName?
// TODO delete or edit filters; easily add filters;
// TODO configurable units km / miles, default to miles (will work for km too, need to be set in settings)
// TODO store search text and filters and location, for session or for userId
// TODO tidy up use of global vars

// TODO custom icons:
//        location
//        people found
//        plants in area
//        business
//        product

// TODO ISSUE circle flying to corner and back when zooming
// L.Circle.prototype._checkIfEmpty = function () { return false; }; // Didn't fix my issue
// Issue with circle is not showing on here: http://codepen.io/kad3nce/pen/ZQYNrq
// next steps:
// 1. try a jsfiddle or a codepen and see if I can reproduce my problem.
// 2. pull out my map from meteor and see if it works
// 3. Try set to Canvas  vs SVG ?

// TODO alter leaflet control containers from z-index: 1000 to something lower, example, navbar is also set to 1000
// trying to prevent some display issues: TODO more specific issues before solving them!
// #SearchResultMap > div.leaflet-control-container > div.leaflet-top.leaflet-left
// #SearchResultMap > div.leaflet-control-container > div.leaflet-top.leaflet-right
// #SearchResultMap > div.leaflet-control-container > div.leaflet-bottom.leaflet-left
// #SearchResultMap > div.leaflet-control-container > div.leaflet-bottom.leaflet-right
  
// TODO simplest approximation is rectangular bounds of circle
  // ? could use to approx the circle range, example 3 rectangles:
    // - north/south, length = diameter, width=radius
    // - east/west, length = diameter, width=radius
    // - square, side = 3/4 diameter  

// TODO getCurrentPosition() is supposed to be used on a secure website, i.e. with https
  
  
// map vars
var leafletmapp;
var circleSearch;
var circleDisplay;
var circleBox;
var peopleMarkersGroup = L.layerGroup();
var locationLatLng = new L.LatLng(26.076477, -80.252113); // Davie
var locationRange; // meters
var locationIcon = new L.Icon.Default({
  iconSize: [20, 32],    // default [25, 41]
  iconAnchor: [10, 32],    // default [12, 41]
  popupAnchor: [1, -26],    // default [1, -34]
  shadowSize: [32, 32],    // default [41, 41]
  });
var locationMarker = L.marker();
locationMarker.setIcon(locationIcon);
locationMarker.bindPopup("Search location");
var myLocationMarker = L.marker().bindPopup('');
var myLocationCircle = L.circle();

// add notify message to page
function searchNotify(alertType, message) {
  var div = '<div class="row"><div class="alert ' + 
    alertType + 
    ' alert-dismissible col-md-6 col-sm-6 col-xs-12" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
    message + 
    '</div></div>';
  $('#searchNotifyDiv').after(div);
}

function onLocationFound(e) {
  // remove or initialise marker and circle
  if (myLocationMarker) {
    leafletmapp.removeLayer(myLocationMarker).closePopup();
    leafletmapp.removeLayer(myLocationCircle);
  } else {
    myLocationMarker = L.marker().bindPopup('');
    myLocationCircle = L.circle();
  }
  // new position
  var radius = e.accuracy / 2;
  myLocationMarker.setPopupContent("You are within " + radius + " meters from this point");
  myLocationMarker.setLatLng(e.latlng).addTo(leafletmapp).openPopup();
  myLocationCircle = L.circle(e.latlng, radius).addTo(leafletmapp);
  // timer to close popup and remove circle
  Meteor.setTimeout(function () {
    myLocationMarker.closePopup();
    leafletmapp.removeLayer(myLocationCircle);
  }, 2000);
}

function onLocationError(e) {
  searchNotify('alert-warning', e.message);
}

function calcBoundsByRange(centerLatLng, range, rangeUnits) {
  // console.log('calcBoundsByRange(centerLatLng: ', centerLatLng);
  // console.log('calcBoundsByRange(range: ' + range + ', rangeUnits: ' + rangeUnits);
  // approximation:
  // Latitude: 1 deg = 110.574 km
  // Longitude: 1 deg = 111.320*cos(latitudeRadians) km
  var rangeKm;
  if (rangeUnits) {
    rangeKm = 0 + range;
  } else { // convert from miles
    rangeKm = (0 + range) * 1.60934;
  }
  locationRange = rangeKm * 1000;
  // console.log('calcBoundsByRange(range in km: ', rangeKm);
  var latRadians = centerLatLng.lat * Math.PI / 180;
  var deltaLat = rangeKm / 110.574;
  var deltaLng = rangeKm / (111.320 * Math.cos(latRadians));
  var southWest = L.latLng(centerLatLng.lat - deltaLat, centerLatLng.lng - deltaLng);
  var northEast = L.latLng(centerLatLng.lat + deltaLat, centerLatLng.lng + deltaLng);
  var bounds = L.latLngBounds(southWest, northEast);
  // console.log('calcBoundsByRange(new bounds: ', bounds);
  return bounds;
}

Template.search.helpers({
  // TODO item in list to have link to view map marker
  peopleIndex: () => PeopleIndex,
  inputAttributes: function () {
    return { 
      'class': 'easy-search-input form-control',
      'placeholder': 'Start searching...',
      'value': FlowRouter.getQueryParam("q"), 
    };
  },
  resultsCount: function () {
    return PeopleIndex.getComponentDict().get('count'); // currentCount only for already shown?
  },
  maxShown: 8,
  greaterMax: function(numResults) {
    return numResults > 8; 
  },
});

Template.search.onRendered(function() {
  // console.log('Template.search.onRendered');

  var template = this;
  template.autorun(function() {
    var searchText = FlowRouter.getQueryParam("q");
    // console.log('change in router param q: ', searchText);
    template.$('.easy-search-input').val(searchText);
    // update PeopleIndex search? No, because:
    // submitted search text is listened to, by the easy search component
  });
  template.autorun(function() {
    var city = FlowRouter.getQueryParam("c");
    // console.log('change in router param c: ', city);
    template.$('[name=city]').val(city);
    if (city) {
      PeopleIndex.getComponentMethods().addProps('cityFilter', city);
    } else {
      PeopleIndex.getComponentMethods().removeProps('cityFilter');
    }
  });
  template.autorun(function() {
    var zipcode = FlowRouter.getQueryParam("z");
    // console.log('change in router param z: ', zipcode);
    template.$('[name=zipcode]').val(zipcode);
    if (zipcode) {
      PeopleIndex.getComponentMethods().addProps('zipcodeFilter', zipcode);
    } else {
      PeopleIndex.getComponentMethods().removeProps('zipcodeFilter');
    }
  });
  template.autorun(function() {
    if(Session.get('lat')) {
      locationLatLng.lat = Session.get('lat');
    }
    if(Session.get('lng')) {
      locationLatLng.lng = Session.get('lng');
      console.log('loading lat/lng from session: ', locationLatLng);
    }
  });
  template.autorun(function() {
    var range = FlowRouter.getQueryParam("r");
    var rangeUnits = FlowRouter.getQueryParam("ru");
    // console.log('change in router param r / ru: ', range + rangeUnits);
    template.$('[name=range]').val(range);
    template.$('.range-units').val(rangeUnits);
    // console.log('update search index filter');
    if (range && range > 0.01 && range < 20000 ) { // limit the range
      PeopleIndex.getComponentMethods().addProps('rangeFilter', calcBoundsByRange(locationLatLng, range, rangeUnits));
    } else {
      locationRange = 0;
      PeopleIndex.getComponentMethods().removeProps('rangeFilter');
    }
    // in browser console, look for: PeopleIndex.components.__default.keys.searchOptions
  });
});

Template.search.events({
  'change .easy-search-input': function (e) { // submit?
    // console.log('easy-search-input change event: update router query params');
    var searchText = $(e.target).val() ? $(e.target).val() : null;
    FlowRouter.setQueryParams({q: searchText});
  },
  'submit .search-form': function(e) {
    // console.log('easy-search-input submit event: send key up: enter');
    e.preventDefault();
    // send Enter key to trigger search on input
    var newEvent = $.Event('keyup');
    newEvent.keyCode = 13;
    $('.easy-search-input').trigger(newEvent);
  },
  'change [name=city]': function (e) {
    // console.log('city change event: update router query params');
    var city = $(e.target).val() ? $(e.target).val() : null;
    FlowRouter.setQueryParams({c: city});
  },
  'change [name=zipcode]': function (e) {
    // console.log('zipcode change event: update router query params');
    var zipcode = $(e.target).val() ? $(e.target).val() : null;
    FlowRouter.setQueryParams({z: zipcode});
  },
  'change [name=range]': function (e) {
    // console.log('range change event: update router query params');
    var range = $(e.target).val() ? $(e.target).val() : null;
    FlowRouter.setQueryParams({r: range});
  },
  'change .range-units': function (e) {
    // console.log('range-units change event: update router query params');
    var ru = $(e.target).val() ? $(e.target).val() : null;
    FlowRouter.setQueryParams({ru: ru});
  },
  'click #addSamplePeopleButton': function(event, template) {
    event.preventDefault();
    var addedList = Meteor.call('addSearchSamplePeople', function (error, result) { 
      // console.log('addedList:', result);
      var index;
      var html='<ul>';
      for (index = 0; index < result.length; ++index) {
          // console.log(result[index]);
          html = html + '<li>' + result[index] + '</li>';
      }
      html = html + '</ul>';
      searchNotify('alert-info', 'People added.' + html);
    });
  },
  'click #removeSamplePeopleButton': function(event) {
    event.preventDefault();
    var addedList = Meteor.call('removeSearchSamplePeople', function (error, result) { 
      if (error) {
        searchNotify('alert-danger', error.message);
      } else {
        searchNotify('alert-info', 'Sample people removed.');
      }
    });
  },
  'click #viewCurrentLocationButton': function(event) {
    event.preventDefault();
    leafletmapp.locate({setView: true, maxZoom: 18});
  },
  'click #updateMapButton': function(event) {
    event.preventDefault();

    // rendering of map is cleaner, if remove stuff first, set view, then add to map
    
    // clear previous location marker
    if (leafletmapp.hasLayer(locationMarker)) {
      leafletmapp.removeLayer(locationMarker);
    }

    // clear previous markers
    if (leafletmapp.hasLayer(peopleMarkersGroup)) {
      leafletmapp.removeLayer(peopleMarkersGroup);
    }
    
    // clear search radius circle
    if (leafletmapp.hasLayer(circleDisplay)) {
      leafletmapp.removeLayer(circleDisplay);
    }
    
    // add markers to peopleMarkersGroup, recalc bounds, not display yet
    peopleMarkersGroup.clearLayers();
    var peopleLatLngList = [];
    if (PeopleIndex.getComponentDict().get('currentCount')) {
      // for each person in search results cursor, get latlng, add marker to map
      var peopleCursor = PeopleIndex.getComponentMethods().getCursor();
      // console.log('peopleCursor before fetch', peopleCursor);
      var peopleList = peopleCursor.fetch();  // TODO FIXME  is this the wrong place to do the fetch?
      // console.log('peopleCursor after fetch', peopleCursor);
      // console.log('peopleList after fetch', peopleList);
      peopleList.forEach(function (person) {
        // console.log("Name of person: ", person.firstname);
        // console.log("latlng: ", person.latlng);
        if (person.latlng) {
          var marker = L.marker(person.latlng);
          // TODO popup to have: picture, link back to item in list
          var popupText = "<b>" + person.fullname + "</b>";
          if (person.city) {
            popupText = popupText + "<br>" + person.city;
          }
          marker.bindPopup(popupText);
          // add marker to marker group for search results
          peopleMarkersGroup.addLayer(marker);
          // add latlng to a list
          peopleLatLngList.push(person.latlng);
        }
      });
    }
    
    // set map view to first of:
    //   bounds from markers, if any
    //   (todo) bounds of search range, if any
    //   location with zoom 11
    
    // leafletmapp.fitBounds(circleDisplay.getBounds(), {maxZoom: 19}); // TODO needs heavy editing
    
    if (peopleLatLngList.length > 0) {
      // adjust bounds for map
      var peopleBounds = L.latLngBounds(peopleLatLngList);
      leafletmapp.fitBounds(peopleBounds);
    } else {
      leafletmapp.setView(locationLatLng, 11);
    }
    
    // add location marker
    locationMarker.setLatLng(locationLatLng);
    locationMarker.addTo(leafletmapp);
    
/*
    // TODO maybe add this back in later
    // add circle to show search radius, if any
    circleDisplay = L.circle(locationLatLng, locationRange, {
      color: 'blue',
      fill: false,
      // fillColor: '#31d',
      // fillOpacity: 0.2,
    });
    circleDisplay.addTo(leafletmapp);
*/

    // TODO timeout then take circle off, it looks crap when zooming // OR FIX THE DAMN BUG
    
    // add markers (peopleMarkersGroup) to map, if any
    peopleMarkersGroup.addTo(leafletmapp);
  },
});

Template.searchMap.onRendered(function() {
  // console.log('Template.searchMap.onRendered');

  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
  leafletmapp = L.map('SearchResultMap');
  var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';  // no https certificate on osm.org
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 19, attribution: osmAttrib});   
  leafletmapp.addLayer(osm);

  // map won't show much until view is set

  leafletmapp.on('locationerror', onLocationError);
  leafletmapp.on('locationfound', onLocationFound);

  // defaults to show map...
  // 1. loaded latlng from collection
  // 2. system default (Davie)
  if (Meteor.userId()) {
    Meteor.call('loadLatLng', function(error, newLatLng) {
      if (error) {
        // okay that it's not available, use system default
        newLatLng = {lat: 26.064975195273117, lng: -80.2321028709411}; // busy traffic!
        searchNotify('alert-info', '<p>Using default location in Davie.</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
      } else {
        searchNotify('alert-info', '<p>Loaded from collection ...</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
      }
      // view on map
      if (myLocationMarker) {
        leafletmapp.removeLayer(myLocationMarker).closePopup();
        leafletmapp.removeLayer(myLocationCircle);
      }
      myLocationMarker = L.marker(newLatLng, {draggable: true});
      myLocationMarker.addTo(leafletmapp);
      leafletmapp.setView(newLatLng, 17);
    });
  } else {
    // TODO refactor
    // use system default
    newLatLng = {lat: 26.064975195273117, lng: -80.2321028709411}; // busy traffic!
    searchNotify('alert-info', '<p>Using default location in Davie.</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
    // view on map
    if (myLocationMarker) {
      leafletmapp.removeLayer(myLocationMarker).closePopup();
      leafletmapp.removeLayer(myLocationCircle);
    }
    myLocationMarker = L.marker(newLatLng, {draggable: true});
    myLocationMarker.addTo(leafletmapp);
    leafletmapp.setView(newLatLng, 17);
  }
});

// Template.awesomeAutosuggest.helpers({
  // peopleIndex: () => PeopleIndex,
// });

// test code On Client to try the index search
// Tracker.autorun(function () {
  // let cursor = PeopleIndex.search('du'); // search all docs that contain "du" in the firstname or lastname field
  // var a = cursor.fetch();
  // if (a.length > 0) {
    // console.log('try search, a[0].fullname: ', a[0].fullname);
  // }
  // if (a.length > 1) {
    // console.log('try search, a[1].fullname: ', a[1].fullname);
  // }
  // console.log('try search, cursor.count(): ', cursor.count()); // log count of all found documents
// });
