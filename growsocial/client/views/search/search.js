// TODO multiple search indexes for different search entities (person/product/event)
// TODO filter based on range from map location
// TODO filter based on area (township name) or postcode (zipcode)
// TODO list result and map result, linked
// TODO link to navbar search
// TODO autosuggest, rather than autosearch, on paused typing
// TODO pagination, more results than limit, etc.

Template.search.helpers({
  peopleIndex: () => PeopleIndex,
  inputAttributes: function () {
    return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
  },
  resultsCount: function () {
    return PeopleIndex.getComponentDict().get('count');
  },
});

var circle;
var circleBox;

Template.search.events({
  'change .location-filter': function (e) {
    // console.log('selected location-filter: ', $(e.target).val());
    PeopleIndex.getComponentMethods().addProps('locationFilter', $(e.target).val());
  },
  'change .range-filter': function (e) {
    // If changed from previous radius, change map zoom/position
    // console.log('selected range-filter: ', $(e.target).val());
    // PeopleIndex.getComponentMethods().addProps('rangeFilter', $(e.target).val());
    if ($(e.target).val()) {
      // alter size of circle
      circle.setRadius($(e.target).val());
      // add to map if not already
      if (!leafletmapp.hasLayer(circle)) {
        circle.addTo(leafletmapp);
      }
      // DEBUG show the bounding rectangle of the circle
      circleBox.setBounds(circle.getBounds());
      if (!leafletmapp.hasLayer(circleBox)) {
        circleBox.addTo(leafletmapp);
      }
      // set map to new circle
      leafletmapp.fitBounds(circle.getBounds(), {maxZoom: 19});

      // TODO if circle was removed from map, re-add it
      // TODO requery by altering range filter
      
      // NO LONGER NEED THIS METHOD
      // Attempt to set zoom to fit the circle nicely
      // (depends on size of map (reactive) and size of circle!)
      // var radiusToZoom = {500: 15, 1000: 14, 2000: 13, 5000: 12,};
      // leafletmapp.setZoom(radiusToZoom[$(e.target).val()]);
    } else {
      if (leafletmapp.hasLayer(circle)) {
        // remove circle
        leafletmapp.removeLayer(circle);
        leafletmapp.removeLayer(circleBox);
      }
    }
  },
  'click .addSample': function(event, template) {
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
      var div = '<div class="row"><div class="alert alert-info alert-dismissible col-md-3 col-xs-6" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>People added.' + html + '</div></div>';
      $(".addSample").after(div);
    });
  },
  'click .locateButton': function(event) {
    event.preventDefault();
    // not alter the zoom by locate()
    leafletmapp.locate({setView: true, maxZoom: leafletmapp.getZoom()});
  },
});

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(leafletmapp)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(leafletmapp);
}

function onLocationError(e) {
    var div = '<div class="row"><div class="alert alert-warning alert-dismissible col-md-3 col-xs-6" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + e.message + '</div></div>';
    $(".locateButton").after(div);
}

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

var leafletmapp;

Template.searchMap.rendered = function() {
  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
  /////////////
  leafletmapp = L.map('map').setView([-37.8136, 144.9631], 13);
  // var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: osmAttrib});   
  // leafletmapp.setView(new L.LatLng(-37.8136, 144.9631),8);
  leafletmapp.addLayer(osm);
  /////////////
  var marker = L.marker([-37.8136, 144.9631]).addTo(leafletmapp);
  
  // circle to indicate range
  circle = L.circle([-37.8136, 144.9631], 2000, {
      color: 'blue',
      fillColor: '#31d',
      fillOpacity: 0.2
  }).addTo(leafletmapp);
  leafletmapp.fitBounds(circle.getBounds(), {maxZoom: 19});
  // DEBUG show the bounding rectangle of the circle
  circleBox = L.rectangle(circle.getBounds(), {color: "#ff7800", weight: 1}).addTo(leafletmapp);

  // TODO simplest approximation is rectangular bounds of circle
    // ? could use to approx the circle range, example 3 rectangles:
      // - north/south, length = diameter, width=radius
      // - east/west, length = diameter, width=radius
      // - square, side = 3/4 diameter  
  
  // popup to highlight when click item in list, or click marker
  marker.bindPopup("<b>Mary Jane</b><br>Has been selected.").openPopup();

  // TODO getCurrentPosition() is supposed to be used on a secure website, i.e. with https
  
  leafletmapp.on('locationerror', onLocationError);
  leafletmapp.on('locationfound', onLocationFound);
}
