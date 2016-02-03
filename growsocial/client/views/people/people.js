var leafletmapp;
var peopleMarkersList;

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

    // BUG1 markers only render on first visit when part of group, so have to be re-added on re-render
    // BUG2 marker group makes markers bounce around on zoom and re-render

    if (peopleMarkersList) {
      // clear markers - else each render rewrites new ones and leaves old ones :P
      for (var i=0, len = peopleMarkersList.length; i < len; i++) {
        var marker = peopleMarkersList[i];
        leafletmapp.removeLayer(marker);
      }
    }

    peopleMarkersList = [];
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
        // workaround: add them individually instead
        marker.addTo(leafletmapp);
        peopleMarkersList.push(marker);
        // add latlng to a list
        peopleLatLngList.push(person.latlng);
      }
    });

    // set view to include all markers on the map
    if (peopleLatLngList.length > 0) {
      // adjust bounds for map
      var peopleBounds = L.latLngBounds(peopleLatLngList);
      leafletmapp.fitBounds(peopleBounds);
    } else {
      // default view with no markers, how sad!
      leafletmapp.setView(newLatLng, 11);
    }
    
  });

});
