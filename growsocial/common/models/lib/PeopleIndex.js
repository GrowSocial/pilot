People = new Mongo.Collection('People');

// TODO test engine minimongo vs MongoDB

PeopleIndex = new EasySearch.Index({
  engine: new EasySearch.MongoDB({
    sort: function () {
      return { lastname: 1, firstname: 1 };
    },
    selector: function (searchObject, options, aggregation) {
      // console.log('selector function run');
      let selector = this.defaultConfiguration().selector(searchObject, options, aggregation);
      let townFilter = options.search.props.townFilter;
      if (_.isString(townFilter) && !_.isEmpty(townFilter)) {
        selector.town = townFilter;
        // console.log('setting selector.town to townFilter: ', townFilter);
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
