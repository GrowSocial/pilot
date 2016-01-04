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

Template.search.events({
  'change .location-filter': function (e) {
    // console.log('selected location-filter: ', $(e.target).val());
    PeopleIndex.getComponentMethods().addProps('locationFilter', $(e.target).val());
  },
  'change .range-filter': function (e) {
    // console.log('selected range-filter: ', $(e.target).val());
    // PeopleIndex.getComponentMethods().addProps('rangeFilter', $(e.target).val());
    if ($(e.target).val()) {
      // alter size of circle
      circle.setRadius($(e.target).val());
      // TODO if was removed from map, re-add it
      // TODO if changed from previous radius, change map zoom/position
      // TODO requery by altering range filter
      // TODO attempt to set zoom to fit the circle nicely
      //      depends on size of map (reactive) and size of circle!
      var radiusToZoom = {500: 15, 1000: 14, 2000: 13, 5000: 12,};
      leafletmapp.setZoom(radiusToZoom[$(e.target).val()]);
    } else {
      // TODO remove circle
    }
  },
  'click .addSample': function(event, template) {
    event.preventDefault();
    var addedList = Meteor.call('addSearchSamplePeople', function (error, result) { 
      console.log('addedList:', result);
      var index;
      var html='<ul>';
      for (index = 0; index < result.length; ++index) {
          console.log(result[index]);
          html = html + '<li>' + result[index] + '</li>';
      }
      html = html + '</ul>';
      var div = '<div class="row"><div class="alert alert-info alert-dismissible col-md-3 col-xs-6" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>People added.' + html + '</div></div>';
      $(".addSample").after(div);
    });
  },
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

var leafletmapp;

Template.searchMap.rendered = function() {
  //map code 
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  // L.tileLayer.provider('Thunderforest.Outdoors').addTo(leafletmapp);
  /////////////
  leafletmapp = L.map('map').setView([-37.8136, 144.9631], 12);
  // var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  // var osmAttrib='Map data © OpenStreetMap contributors';
  var osmAttrib='&copy; OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 15, attribution: osmAttrib});   
  // leafletmapp.setView(new L.LatLng(-37.8136, 144.9631),8);
  leafletmapp.addLayer(osm);
  /////////////
  var marker = L.marker([-37.8136, 144.9631]).addTo(leafletmapp);
  
  // circle to indicate range
  circle = L.circle([-37.8136, 144.9631], 5000, {
      color: 'blue',
      fillColor: '#31d',
      fillOpacity: 0.2
  }).addTo(leafletmapp);
  console.log('circle:',circle);

  // popup to highlight when click item in list, or click marker
  marker.bindPopup("<b>Mary Jane</b><br>Has been selected.").openPopup();

  // TODO getCurrentPosition() is supposed to be used on a secure website, i.e. with https
  
}
