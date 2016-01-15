// TODO multiple search indexes for different search entities (person/product/event)
// TODO filter based on range from map location
// TODO filter based on area (township name) or postcode (zipcode)
// TODO list result and map result, linked
// TODO autosuggest, rather than autosearch, on paused typing
// TODO pagination, more results than limit, etc.
// TODO refresh should re-search
// TODO initiate search when type into navSearchText and press enter/button
//        nearly there, copies the value over!
// TODO default search filters: radius 5km, search type product
// TODO remember last search options: 
//        radius, town, search entity type person/product/business/etc, search word (if navsearch is blank use last search)
// TODO search results link to: person; highlight map ref (default); expand details (default)
// TODO to simplify vendor search, each product can have vendorLink? and vendorName?
// TODO human editable radius
// TODO delete or edit filters; easily add filters;
// TODO configurable units km / miles, default to florida units
// TODO store search text and filters and location, for session or for userId
// TODO tidy up use of global vars

// map vars
var leafletmapp;
var circleSearch;
var circleDisplay;
var circleBox;
var peopleMarkersGroup;
var locationMarker;
var locationLatLng = new L.LatLng(-37.8136, 144.9631);

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
  if (locationMarker) {
    leafletmapp.removeLayer(locationMarker).closePopup();
    leafletmapp.removeLayer(locationCircle);
  } else {
    locationMarker = L.marker().bindPopup('');
    locationCircle = L.circle();
  }
  // new position
  var radius = e.accuracy / 2;
  locationMarker.setPopupContent("You are within " + radius + " meters from this point");
  locationMarker.setLatLng(e.latlng).addTo(leafletmapp).openPopup();
  locationCircle = L.circle(e.latlng, radius).addTo(leafletmapp);
  // timer to close popup and remove circle
  Meteor.setTimeout(function () {
    locationMarker.closePopup();
    leafletmapp.removeLayer(locationCircle);
  }, 2000);
}

function onLocationError(e) {
  searchNotify('alert-warning', e.message);
}

function calcBoundsByRange(centerLatLng, range, rangeUnits) {
  console.log('calcBoundsByRange(centerLatLng: ', centerLatLng);
  console.log('calcBoundsByRange(range: ' + range + ', rangeUnits: ' + rangeUnits);
  // approximation:
  // Latitude: 1 deg = 110.574 km
  // Longitude: 1 deg = 111.320*cos(latitudeRadians) km
  var rangeKm;
  if (rangeUnits) {
    rangeKm = range;
  } else { // convert from miles
    rangeKm = range * 1.60934;
  }
  console.log('calcBoundsByRange(range in km: ', rangeKm);
  var latRadians = centerLatLng.lat * Math.PI / 180;
  var deltaLat = rangeKm / 110.574;
  var deltaLng = rangeKm / (111.320 * Math.cos(latRadians));
  var southWest = L.latLng(centerLatLng.lat - deltaLat, centerLatLng.lng - deltaLng);
  var northEast = L.latLng(centerLatLng.lat + deltaLat, centerLatLng.lng + deltaLng);
  var bounds = L.latLngBounds(southWest, northEast);
  console.log('calcBoundsByRange(new bounds: ', bounds);
  return bounds;
}

Template.search.helpers({
  peopleIndex: () => PeopleIndex,
  inputAttributes: function () {
    return { 
      'class': 'easy-search-input', 
      'placeholder': 'Start searching...',
      'value': FlowRouter.getQueryParam("q"), 
    };
  },
  resultsCount: function () {
    return PeopleIndex.getComponentDict().get('count');
  },
});

Template.search.onRendered(function() {
  console.log('Template.search.onRendered');

  var template = this;
  template.autorun(function() {
    var searchText = FlowRouter.getQueryParam("q");
    console.log('change in router param q: ', searchText);
    template.$('.easy-search-input').val(searchText);
    // update PeopleIndex search? No, because:
    // submitted search text is listened to, by the easy search component
  });
  template.autorun(function() {
    var city = FlowRouter.getQueryParam("c");
    console.log('change in router param c: ', city);
    template.$('[name=city]').val(city);
    if (city) {
      PeopleIndex.getComponentMethods().addProps('cityFilter', city);
    } else {
      PeopleIndex.getComponentMethods().removeProps('cityFilter');
    }
  });
  template.autorun(function() {
    var range = FlowRouter.getQueryParam("r");
    var rangeUnits = FlowRouter.getQueryParam("ru");
    console.log('change in router param r / ru: ', range + rangeUnits);
    template.$('[name=range]').val(range);
    template.$('.range-units').val(rangeUnits);
    console.log('update search index filter');
    if (range && range > 0.01 && range < 20000 ) { // limit the range
      PeopleIndex.getComponentMethods().addProps('rangeFilter', calcBoundsByRange(locationLatLng, range, rangeUnits));
    } else {
      PeopleIndex.getComponentMethods().removeProps('rangeFilter');
    }
    // in browser console, look for: PeopleIndex.components.__default.keys.searchOptions
  });
});

Template.search.events({
  'change .easy-search-input': function (e) { // submit?
    // PeopleIndex.getComponentMethods().addProps('cityFilter', $(e.target).val());
    console.log('easy-search-input change event: update router query params');
    FlowRouter.setQueryParams({q: $(e.target).val()});
  },
  'change [name=city]': function (e) {
    // PeopleIndex.getComponentMethods().addProps('cityFilter', $(e.target).val());
    console.log('city change event: update router query params');
    FlowRouter.setQueryParams({c: $(e.target).val()});
  },
  'change [name=range]': function (e) {
    // PeopleIndex.getComponentMethods().addProps('cityFilter', $(e.target).val());
    console.log('range change event: update router query params');
    FlowRouter.setQueryParams({r: $(e.target).val()});
  },
  'change .range-units': function (e) {
    console.log('range-units change event: update router query params');
    var ru = $(e.target).val() ? $(e.target).val() : null;
    FlowRouter.setQueryParams({ru: ru});
  },
  'change .range-filter': function (e) { // no longer needed?
    var rangeSelected = $(e.target).val();
    // If changed from previous radius, change map zoom/position
    // console.log('selected range-filter: ', $(e.target).val());
    // PeopleIndex.getComponentMethods().addProps('rangeFilter', $(e.target).val());
    if (rangeSelected) {
      // alter size of circle
      circleSearch.setRadius(rangeSelected);

      // to work out bounds, circle needs to be on the map!
      leafletmapp.addLayer(circleSearch);
      var searchBounds = circleSearch.getBounds();
      leafletmapp.removeLayer(circleSearch);
      
      // filter people index by the bounds of the circle
      PeopleIndex.getComponentMethods().addProps('rangeFilter', searchBounds);
    } else {
      // "no range" selected...
      PeopleIndex.getComponentMethods().addProps('rangeFilter', null);
    }
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
  'click #setMapLocationButton': function(event) {
    event.preventDefault();
    // not alter the zoom by locate()
    leafletmapp.locate({setView: true, maxZoom: leafletmapp.getZoom()});
  },
  'click #updateMapButton': function(event) {
    event.preventDefault();

    if (circleSearch.getRadius() > 0) {

      // update displayed circle
      circleDisplay.setLatLng(circleSearch.getLatLng());
      circleDisplay.setRadius(circleSearch.getRadius());

      // add to map if not already
      if (!leafletmapp.hasLayer(circleDisplay)) {
        circleDisplay.addTo(leafletmapp);
      }
      
      // show the bounding rectangle of the circle, what is included in the search area
      if (!circleBox) {
        circleBox = L.rectangle(circleDisplay.getBounds(), {color: "#ff7800", weight: 1});
      }
      circleBox.setBounds(circleDisplay.getBounds());
      if (!leafletmapp.hasLayer(circleBox)) {
        circleBox.addTo(leafletmapp);
      }

      // set map to fit to new circle
      leafletmapp.fitBounds(circleDisplay.getBounds(), {maxZoom: 19});

      // draw markers for peoples latlng in search result

      // remove previous search results from the marker group, removes from map
      if(!peopleMarkersGroup) {
        peopleMarkersGroup = L.layerGroup();
      }
      peopleMarkersGroup.clearLayers();
      
      // console.log("PeopleIndex.getComponentDict().get('count'): ",PeopleIndex.getComponentDict().get('count'));
      // console.log("PeopleIndex.getComponentDict().get('currentCount'): ",PeopleIndex.getComponentDict().get('currentCount'));
      if (PeopleIndex.getComponentDict().get('count')) {
        // TODO for each person in search results cursor, get latlng, add marker to map
        var peopleCursor = PeopleIndex.getComponentMethods().getCursor();
        // console.log('peopleCursor before fetch', peopleCursor);
        var peopleList = peopleCursor.fetch();  // TODO FIXME  this is the wrong place to do the fetch!
        // console.log('peopleCursor after fetch', peopleCursor);
        // console.log('peopleList after fetch', peopleList);
        peopleList.forEach(function (person) {
          // console.log("Name of person: ", person.firstname);
          // console.log("latlng: ", person.latlng);
          if (person.latlng) {
            var marker = L.marker(person.latlng);
            marker.bindPopup("<b>" + person.fullname + "</b><br>" + person.city);
            // add marker to marker group for search results
            peopleMarkersGroup.addLayer(marker);
          }
        });
        peopleMarkersGroup.addTo(leafletmapp);
      }
    } else { // no range selected

      if (leafletmapp.hasLayer(circleDisplay)) {
        // remove circle
        leafletmapp.removeLayer(circleDisplay);
        leafletmapp.removeLayer(circleBox);
      }
    } // range / no range
  },
});

Template.searchMap.onRendered(function() {
  console.log('Template.searchMap.onRendered');

  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
  /////////////
  leafletmapp = L.map('SearchResultMap').setView([-37.8136, 144.9631], 13);
  var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';  // no https certificate on osm.org
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: osmAttrib});   
  leafletmapp.setView(new L.LatLng(-37.8136, 144.9631),8);
  leafletmapp.addLayer(osm);
  /////////////
  
  // TODO custom icons:
  //        location
  //        people found
  //        plants in area
  //        business
  //        product
  // smaller icon to make it distinct from the others
  var locationIcon = new L.Icon.Default({
    iconSize: [20, 32],    // default [25, 41]
    iconAnchor: [10, 32],    // default [12, 41]
    popupAnchor: [1, -26],    // default [1, -34]
    shadowSize: [32, 32],    // default [41, 41]
    });
  var marker = L.marker([-37.8136, 144.9631], {icon: locationIcon}).addTo(leafletmapp);
  
  marker.bindPopup("Search location");

  // TODO popup to highlight when click item in list, or click marker
  
  // circle to indicate range
  circleSearch = L.circle([-37.8136, 144.9631], 2000);
  circleDisplay = L.circle([-37.8136, 144.9631], 2000, {
      color: 'blue',
      fill: false,
      // fillColor: '#31d',
      // fillOpacity: 0.2,
  });
  
  // TODO simplest approximation is rectangular bounds of circle
    // ? could use to approx the circle range, example 3 rectangles:
      // - north/south, length = diameter, width=radius
      // - east/west, length = diameter, width=radius
      // - square, side = 3/4 diameter  

  // TODO getCurrentPosition() is supposed to be used on a secure website, i.e. with https
  
  leafletmapp.on('locationerror', onLocationError);
  leafletmapp.on('locationfound', onLocationFound);
});

// easysearch:autosuggest has issues, maybe needing config changes to fix?
// bug?  repeats the suggest values to about four times each ??? is there a default create config?
// bug? timeout not working for auto suggest? think it is configured differently to search.

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
