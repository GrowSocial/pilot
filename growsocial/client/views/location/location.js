  
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
    myLocationMarker.unbindPopup();
    leafletmapp.removeLayer(myLocationCircle);
  }, 2000);
  locationNotify('alert-info', '<p>Loaded from browser ...</p><p>Lat: ' + e.latlng.lat + ' </p><p>Long: ' + e.latlng.lng + '</p>');
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

Template.location.onRendered(function() {
  // console.log('Template.location.onRendered');
  
    if(Session.get('lat')) {
      locationLatLng.lat = Session.get('lat');
      locationLatLng.lng = Session.get('lng');
      console.log('loading lat/lng from session: ', locationLatLng);
    }
});

Template.location.events({
  'click #setFromBrowserButton': function(event) {
    event.preventDefault();
    leafletmapp.locate({setView: true, maxZoom: 17});
  },
  'click #loadLocationButton': function(event) {
    event.preventDefault();
    Meteor.call('loadLatLng', function(error, newLatLng) {
      if (error) {
        // TODO log the error
        locationNotify('alert-danger', error.message);
      } else {
        locationNotify('alert-info', '<p>Loaded from collection ...</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
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
    // console.log("LATLNG:", newLatLng);
    if (Meteor.user()) {
      
    } else { // anonymous user
      
    }
    // at the moment, put both into Session
    Session.set({
      lat: newLatLng.lat,
      lng: newLatLng.lng,
    });
    // save into collection
    Meteor.call('saveLatLng', newLatLng, function(error) {
      if (error) {
        // TODO log the error
        locationNotify('alert-danger', error.message);
      } else {
        locationNotify('alert-info', '<p>Saved to collection ...</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
      }
    });
    
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
