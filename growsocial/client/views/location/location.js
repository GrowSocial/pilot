  
// map vars
var leafletmapp;
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
  }
  myLocationCircle = L.circle();
  // new position
  var radius = e.accuracy / 2;
  myLocationMarker = L.marker(e.latlng, {draggable: true}).bindPopup("You are within " + radius + " meters from this point");
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
  locationNotify('alert-warning', e.message);
}

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
    var newLatLng = myLocationMarker.getLatLng();
    if (newLatLng.lng > 180.0) {
      newLatLng.lng = newLatLng.lng - 360;
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
  
  // defaults to show map...
  // 1. loaded latlng from collection
  // 2. system default (Davie)
  Meteor.call('loadLatLng', function(error, newLatLng) {
    if (error) {
      // okay that it's not available, use system default
      newLatLng = {lat: 26.064975195273117, lng: -80.2321028709411}; // busy traffic!
      locationNotify('alert-info', '<p>Using default location in Davie.</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
    } else {
      locationNotify('alert-info', '<p>Loaded from collection ...</p><p>Lat: ' + newLatLng.lat + ' </p><p>Long: ' + newLatLng.lng + '</p>');
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
});
