var peopleMarkersGroup;
var leafletmapp;

Template.people.helpers({

/* for loading the list of 
   profile collections from DB for viewing by logged-in member.
*/
  people: function () {
    return People.find({},{sort: {lastname: 1, firstname: 1}});
  },
  notAdmin: function(person) {
    return (person.member_key != 'pseudo_0');
  },

/*  
  used to convey which profile is selected, to profile.html
  */
  pathForProfile: function(person) {
    var params = {
      personId: person.member_key
    };
    var path = FlowRouter.path("profile", params);
    return path;
  }

});

Template.peopleMap.onRendered(function() {

  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
  leafletmapp = L.map('peopleMap');
  var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';  // no https certificate on osm.org
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 19, attribution: osmAttrib});   
  leafletmapp.addLayer(osm);

  // map won't show much until view is set
  
  var newLatLng = {lat: 26.064975195273117, lng: -80.2321028709411}; // busy traffic!
  leafletmapp.setView(newLatLng, 11);
  
  // iterate the people cursor passed into the template
  var peopleCursor = this.data.people;
  
  this.autorun(function() {

    if (peopleMarkersGroup) {
      // clear markers - else each render rewrites new ones and leaves old ones :P
      // by default we don't have the group on the map, due to zooming bugs
      // add group to map, then remove it, to clear previous markers.
      // This makes a bouncy affect on every render, better than on every zoom!
      peopleMarkersGroup.addTo(leafletmapp);
      leafletmapp.removeLayer(peopleMarkersGroup);
      peopleMarkersGroup.clearLayers();
    } else {
      peopleMarkersGroup = L.layerGroup();
    }

    var peopleLatLngList = [];

    peopleCursor.forEach(function(person) {
      if (person.latlng) {
        var marker = L.marker(person.latlng);

        // TODO popup to have: picture, link back to item in list
        var popupText = "<b>" + person.fullname + "</b>";
        if (person.city) {
          popupText = popupText + "<br>" + person.city;
        }
        marker.bindPopup(popupText);
        
        // BUG markers only render on first visit when part of group
        // workaround: add them individually as well
        marker.addTo(leafletmapp);
        peopleMarkersGroup.addLayer(marker);
        // add latlng to a list
        peopleLatLngList.push(person.latlng);
      }
    });

    // set view to include all markers on the map
    if (peopleLatLngList.length > 0) {
      // BUG1 markers only render on first visit when part of group
      // BUG2 marker group makes markers bounce around on zoom
      // peopleMarkersGroup.addTo(leafletmapp);
      // adjust bounds for map
      var peopleBounds = L.latLngBounds(peopleLatLngList);
      leafletmapp.fitBounds(peopleBounds);
    } else {
      // default view with no markers, how sad!
      leafletmapp.setView(newLatLng, 11);
    }
    
  });

});
