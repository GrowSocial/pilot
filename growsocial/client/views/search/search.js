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
var peopleMarkersGroup;

function searchNotify(alertType, message) {
  var div = '<div class="row"><div class="alert ' + 
    alertType + 
    ' alert-dismissible col-md-6 col-sm-6 col-xs-12" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
    message + 
    '</div></div>';
  $('#searchNotifyDiv').after(div);
}

Template.search.events({
  'change .city-filter': function (e) {
    // console.log('selected city-filter: ', $(e.target).val());
    PeopleIndex.getComponentMethods().addProps('cityFilter', $(e.target).val());
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

      // NO LONGER NEED THIS METHOD
      // Attempt to set zoom to fit the circle nicely
      // (depends on size of map (reactive) and size of circle!)
      // var radiusToZoom = {500: 15, 1000: 14, 2000: 13, 5000: 12,};
      // leafletmapp.setZoom(radiusToZoom[$(e.target).val()]);

      // set map to fit to new circle
      leafletmapp.fitBounds(circle.getBounds(), {maxZoom: 19});

      // draw markers for peoples latlng in search result

      // remove previous search results from the marker group, removes from map
      if(!peopleMarkersGroup) {
        peopleMarkersGroup = L.layerGroup();
      }
      peopleMarkersGroup.clearLayers();
      
      if (PeopleIndex.getComponentDict().get('count')) {
        // TODO for each person in search results cursor, get latlng, add marker to map
        var peopleCursor = PeopleIndex.getComponentMethods().getCursor();
        // console.log('peopleCursor', peopleCursor);
        var peopleList = peopleCursor.fetch();  // TODO FIXME  this is the wrong place to do the fetch!
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
  
      // show latlong of circle centre and latlong of bounds:
      // console.log('circle: ', circle);
      // console.log('circle.getBounds(): ', circle.getBounds());
/*
lat: -37.8136
lng: 144.9631
_mRadius: "1000"

LatLngBounds _northEast: L.LatLng
  lat: -37.80464947213092
  lng: 144.97442965087888
_southWest: L.LatLng
  lat: -37.82255053579303
  lng: 144.95177034912106
*/
      // TODO if circle was removed from map, re-add it
      // TODO requery by altering range filter
      
    } else {
      if (leafletmapp.hasLayer(circle)) {
        // remove circle
        leafletmapp.removeLayer(circle);
        leafletmapp.removeLayer(circleBox);
      }
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
});

function onLocationFound(e) {
  var radius = e.accuracy / 2;
  L.marker(e.latlng).addTo(leafletmapp)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();
  L.circle(e.latlng, radius).addTo(leafletmapp);
}

function onLocationError(e) {
  searchNotify('alert-warning', e.message);
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

Template.search.rendered = function(template) {
  // TODO for each search result, add a marker if have the latlng
  // console.log('template', template); // undefined
  // console.log('template.resultsCount', template.resultsCount);
  // console.log('template.PeopleIndex', template.PeopleIndex);
  // console.log('resultsCount', resultsCount); // undefined
  // console.log('PeopleIndex: ', PeopleIndex); // object
  // console.log("PeopleIndex.getComponentDict().get('count'): ", PeopleIndex.getComponentDict().get('count')); // 0
  // console.log("PeopleIndex.getComponentDict(): ", PeopleIndex.getComponentDict()); // 
/* 
keys:
count: "8"
currentCount: "8"
limit: "8"
searchDefinition: """"
searchOptions: "{}"
searching: "false"
skip: "0"
stopPublication: "false"
 */
  // console.log("PeopleIndex.getComponentMethods(): ", PeopleIndex.getComponentMethods()); // 
/* 
addProps: ()
getCursor: ()
hasMoreDocuments: ()
hasNoResults: ()
isSearching: ()
loadMore: (count)
paginate: (page)
removeProps: ()
search: (searchDefinition)
searchIsEmpty: ()
 */
      // var leafletmarker = L.marker([newlat, newlong]).addTo(leafletmapp);
};

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
  marker.bindPopup("Location for search range").openPopup();

  // TODO getCurrentPosition() is supposed to be used on a secure website, i.e. with https
  
  leafletmapp.on('locationerror', onLocationError);
  leafletmapp.on('locationfound', onLocationFound);
}
