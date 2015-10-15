var Collections = {};

Meteor.isClient && Template.registerHelper("Collections", Collections);

People = Collections.People = new Mongo.Collection("People");
People.attachSchema(Schemas.Person);

Bizness = Collections.Bizness = new Mongo.Collection("Bizness");
Bizness.attachSchema(Schemas.Biz);



Items = Collections.Items = new Mongo.Collection("Items");
Items.attachSchema(Schemas.Item);
