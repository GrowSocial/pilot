// TODO searchbox helper to prompt for suggestions
// TODO filters based on location, search type (person/product)
// TODO list result and map result, linked
// TODO link to navbar search

Template.search.helpers({
  peopleIndex: () => PeopleIndex
});

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
