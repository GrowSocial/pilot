People = new Mongo.Collection('People');

// TODO test engine minimongo vs MongoDB

PeopleIndex = new EasySearch.Index({
  engine: new EasySearch.MongoDB({
    sort: function () {
      return { lastname: 1 };
    },
    selector: function (searchObject, options, aggregation) {
      // console.log('selector function run');
      let selector = this.defaultConfiguration().selector(searchObject, options, aggregation);
      let locationFilter = options.search.props.locationFilter;
      if (_.isString(locationFilter) && !_.isEmpty(locationFilter)) {
        selector.location = locationFilter;
        // console.log('setting selector.location to locationFilter: ', locationFilter);
      }
      return selector;
    },
  }),
  collection: People,
  // fields: ['firstname', 'lastname'], // disadvantage: cannot type fullname to match
  fields: ['fullname'],
  name: 'fullnameIndex',
  defaultSearchOptions: {
    limit: 8
  },
});
