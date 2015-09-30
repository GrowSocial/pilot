if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  var leafletmapp;
  
  Template.body.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(-37.8136, 144.9631),
          zoom: 8
        };
      }
    }
  });

  Template.addmarker.events({
    'click button': function () {
      var newlat = -37.8136 -0.5 + Random.fraction();
      var newlong = 144.9631 -0.5 + Random.fraction();
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(newlat, newlong),
        map: GoogleMaps.maps.exampleMap.instance
      });
      var leafletmarker = L.marker([newlat, newlong]).addTo(leafletmapp);
    }
  });

  Template.body.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
  });

  Template.leafletmap.rendered = function() {
    //map code 
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
    // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
    /////////////
    leafletmapp = L.map('map').setView([-37.8136, 144.9631], 8);
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});   
    // leafletmapp.setView(new L.LatLng(-37.8136, 144.9631),8);
    leafletmapp.addLayer(osm);
    /////////////
    var marker = L.marker([-37.8136, 144.9631]).addTo(leafletmapp);
    
  }
}

