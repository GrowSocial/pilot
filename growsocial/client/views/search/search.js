// TODO searchbox helper to prompt for suggestions
// TODO filters based on location, search type (person/product/all?)
// TODO list result and map result, linked
// TODO link to navbar search
// TODO add sample data to help test search
// TODO autosuggest, rather than autosearch, on paused typing

Template.search.helpers({
  peopleIndex: () => PeopleIndex,
  inputAttributes: function () {
    return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
  },
  resultsCount: function () {
    return PeopleIndex.getComponentDict().get('count');
  },
});

Template.search.events({
  'change .location-filter': function (e) {
    console.log('selected location-filter: ', $(e.target).val());
    PeopleIndex.getComponentMethods().addProps('locationFilter', $(e.target).val());
  },
  'click .addSample': function(event) {
    event.preventDefault();
    var addedList = Meteor.call('addSearchSamplePeople', function (error, result) { 
      console.log('addedList:', result);
    });
    // see here for an example of how to create a popover with the result? http://jsbin.com/zopod/1/edit
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
