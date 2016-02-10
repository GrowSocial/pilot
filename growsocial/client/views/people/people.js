// TODO add a button on the map "back to list"

Template.people.events({
  'click .showMapButton': function(event, instance) {
    event.preventDefault();

    // scroll window to map
    var sel = $('#peopleMap')[0];
    if (sel) sel.scrollIntoView(true);

    if (this.person && this.person.latlng) {
      // jump to person in map
      instance.jumpto.set('person', this.person);
    }
  },
});

Template.personDetail.helpers({
  pathForProfile: function(person) {
    var params = {
      personId: person.member_key
    };
    var path = FlowRouter.path("profile", params);
    return path;
  },
});

Template.people.helpers({
  people: function () {
    return People.find({},{sort: {lastname: 1, firstname: 1}});
  },
  
  notAdmin: function(person) {
    return (person.member_key != 'pseudo_0');
  },
  
  jumpto: function() {
    return Template.instance().jumpto;
  },
});

Template.people.onCreated(function() {
  const instance = this;
  instance.jumpto = new ReactiveDict(); 
});

Template.peopleMap.onCreated(function() {
  const instance = this;
  instance.peopleMarkersList = [];
  instance.leafletmapp = {};
});

Template.peopleMap.onRendered(function() {
  const instance = this;
  
  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(instance.leafletmapp);
  instance.leafletmapp = L.map('peopleMap');
  
  var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';  // no https certificate on osm.org
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 19, attribution: osmAttrib});   
  instance.leafletmapp.addLayer(osm);

  // map won't show much until view is set
  
  // iterate the people cursor passed into the template
  var peopleCursor = instance.data.people;
  
  instance.autorun(function() {

    // BUG1 markers only render on first visit when part of group, so have to be re-added on re-render
    // BUG2 marker group makes markers bounce around on zoom and re-render

    if (instance.peopleMarkersList) {
      // clear markers - else each render rewrites new ones and leaves old ones :P
      for (var i=0, len = instance.peopleMarkersList.length; i < len; i++) {
        var marker = instance.peopleMarkersList[i];
        instance.leafletmapp.removeLayer(marker);
      }
    }

    instance.peopleMarkersList = [];
    var peopleLatLngList = [];

    peopleCursor.forEach(function(person) {
      if (person.latlng) {
        
        // Being selective, only drawing the coords that are in Florida!
        // TODO take this out when enabled the "local area view"
        if (person.latlng.lat >= 23.845649887659352 && 
            person.latlng.lat <= 31.615965936476076 &&
            person.latlng.lng >= -85.078125 && 
            person.latlng.lng <= -79.36523437500001) {
        
          var marker = L.marker(person.latlng);

          // TODO popup to have: profile picture, link back to item in list
          var popupText = "<b>" + person.fullname + "</b>";
          if (person.city) {
            popupText = popupText + "<br>" + person.city;
          }
          marker.bindPopup(popupText);
          
          // BUG markers only render on first visit when part of group
          // workaround: add them individually instead
          marker.addTo(instance.leafletmapp);
          instance.peopleMarkersList.push(marker);
          // add latlng to a list
          peopleLatLngList.push(person.latlng);
        }
      }
    });  // /peopleCursor.forEach

    // set view to include all markers on the map
    if (peopleLatLngList.length > 1) {
      // adjust bounds for map
      var peopleBounds = L.latLngBounds(peopleLatLngList);
      instance.leafletmapp.fitBounds(peopleBounds, {padding: [20,20]}); // padding so markers arent on edges
    } else if (peopleLatLngList.length === 1) {
      instance.leafletmapp.setView(peopleLatLngList[0], 11);
    } else {
      // default view with no markers, how sad!
      var newLatLng = {lat: 26.064975195273117, lng: -80.2321028709411}; // busy traffic!
      instance.leafletmapp.setView(newLatLng, 11);
    }
    
  });   // /autorun

  instance.autorun(function() {
    // pull person chosen through reactiveDict
    var jumptoPerson = instance.data.jumpto && instance.data.jumpto.get('person');
    if (jumptoPerson) {
      var jumptoLatlng = jumptoPerson.latlng;
      
      // find the appropriate marker
      var jumptoMarker = null;
      for (var i=0, len = instance.peopleMarkersList.length; i < len; i++) {
        var marker = instance.peopleMarkersList[i];
        // instance.leafletmapp.removeLayer(marker);
        var mlatlng = marker.getLatLng();
        if (mlatlng.lat === jumptoLatlng.lat && mlatlng.lng === jumptoLatlng.lng) {
          // we have a match!
          jumptoMarker = marker;
          break;
        }
      }
      
      if (!jumptoMarker) {
        // didn't find a marker, so create one
        jumptoMarker = L.marker(jumptoLatlng);

        // TODO popup to have: profile picture, link back to item in list
        var popupText = "<b>" + jumptoPerson.fullname + "</b>";
        if (jumptoPerson.city) {
          popupText = popupText + "<br>" + jumptoPerson.city;
        }
        jumptoMarker.bindPopup(popupText);
        jumptoMarker.addTo(instance.leafletmapp);
      }
      
      // set map to look at chosen jumpto
      instance.leafletmapp.setView(jumptoLatlng, 11);
      jumptoMarker.openPopup();
    }
  });   // /autorun

});
