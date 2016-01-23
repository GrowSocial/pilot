  
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
function locationNotify(alertType, message) {
  var div = '<div class="row"><div class="alert ' + 
    alertType + 
    ' alert-dismissible col-md-6 col-sm-6 col-xs-12" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
    message + 
    '</div></div>';
  $('#locationNotifyDiv').after(div);
}

function onLocationFound(e) {
  // remove or initialise marker and circle
  if (myLocationMarker) {
    leafletmapp.removeLayer(myLocationMarker).closePopup();
    leafletmapp.removeLayer(myLocationCircle);
  // } else {
  }
    myLocationCircle = L.circle();
  // }
  // new position
  var radius = e.accuracy / 2;
  myLocationMarker = L.marker(e.latlng, {draggable: true}).bindPopup("You are within " + radius + " meters from this point");
  // myLocationMarker.setPopupContent("You are within " + radius + " meters from this point");
  // myLocationMarker.setLatLng(e.latlng).addTo(leafletmapp).openPopup();
  myLocationMarker.addTo(leafletmapp).openPopup();
  myLocationCircle = L.circle(e.latlng, radius).addTo(leafletmapp);
  // timer to close popup and remove circle
  Meteor.setTimeout(function () {
    myLocationMarker.closePopup();
    leafletmapp.removeLayer(myLocationCircle);
  }, 2000);
}

function onLocationError(e) {
  // TODO use a default location in this instance,
  // somewhere in florida
  locationNotify('alert-warning', e.message);
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

Template.location.helpers({
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
});

Template.location.onRendered(function() {
  // console.log('Template.search.onRendered');
  
    if(Session.get('lat')) {
      locationLatLng.lat = Session.get('lat');
      locationLatLng.lng = Session.get('lng');
      console.log('loading lat/lng from session: ', locationLatLng);
    }
  

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
      // PeopleIndex.getComponentMethods().addProps('cityFilter', city);
    } else {
      // PeopleIndex.getComponentMethods().removeProps('cityFilter');
    }
  });
  template.autorun(function() {
    var zipcode = FlowRouter.getQueryParam("z");
    // console.log('change in router param z: ', zipcode);
    template.$('[name=zipcode]').val(zipcode);
    if (zipcode) {
      // PeopleIndex.getComponentMethods().addProps('zipcodeFilter', zipcode);
    } else {
      // PeopleIndex.getComponentMethods().removeProps('zipcodeFilter');
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
      // PeopleIndex.getComponentMethods().addProps('rangeFilter', calcBoundsByRange(locationLatLng, range, rangeUnits));
    } else {
      locationRange = 0;
      // PeopleIndex.getComponentMethods().removeProps('rangeFilter');
    }
    // in browser console, look for: PeopleIndex.components.__default.keys.searchOptions
  });
});

Template.location.events({
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
      locationNotify('alert-info', 'People added.' + html);
    });
  },
  'click #removeSamplePeopleButton': function(event) {
    event.preventDefault();
    var addedList = Meteor.call('removeSearchSamplePeople', function (error, result) { 
      if (error) {
        locationNotify('alert-danger', error.message);
      } else {
        locationNotify('alert-info', 'Sample people removed.');
      }
    });
  },
  'click #setMapLocationButton': function(event) {
    event.preventDefault();
    leafletmapp.locate({setView: true, maxZoom: 18});
  },
  'click #saveLocationButton': function(event) {
    event.preventDefault();
    // retrieve latlng from the location marker
    // save latlng to database (logged-in) or session (anonymous)
    // TODO !!!!!!!!!!!!!!!!!
    var newLatLng = myLocationMarker.getLatLng();
    if (newLatLng.lng > 180.0) {
      newLatLng.lng = newLatLng.lng - 360;
    }
    console.log("LATLNG:", newLatLng);
    if (Meteor.user()) {
      
    } else { // anonymous user
      
    }
    // at the moment, put both into Session
    Session.set({
      lat: newLatLng.lat,
      lng: newLatLng.lng,
    });
    locationNotify('alert-info', '<p>Saved to Session ...</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
    
  },
});

Template.locationMap.onRendered(function() {
  // console.log('Template.locationMap.onRendered');

  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
  leafletmapp = L.map('locationMap');
  var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';  // no https certificate on osm.org
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 19, attribution: osmAttrib});   
  leafletmapp.addLayer(osm);

  // map won't show much until view is set

  leafletmapp.on('locationerror', onLocationError);
  leafletmapp.on('locationfound', onLocationFound);
});
