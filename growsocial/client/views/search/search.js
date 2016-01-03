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

Template.search.events({
  'change .location-filter': function (e) {
    console.log('selected location-filter: ', $(e.target).val());
    PeopleIndex.getComponentMethods().addProps('locationFilter', $(e.target).val());
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
