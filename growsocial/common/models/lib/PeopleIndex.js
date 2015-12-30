People = new Mongo.Collection('People');

PeopleIndex = new EasySearch.Index({
  engine: new EasySearch.MongoDB({
    sort: function () {
      return { lastname: 1 };
    },
  }),
  collection: People,
  fields: ['firstname', 'lastname'],   // fields: ['fullname'],
  defaultSearchOptions: {
    limit: 8
  },
});
