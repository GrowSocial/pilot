var Collections = {};

Meteor.isClient && Template.registerHelper("Collections", Collections);

MarketItems = Collections.MarketItems = new Mongo.Collection("MarketItems");
MarketItems.attachSchema(Schemas.MarketItems);

Member_Videos = Collections.Member_Videos = new Mongo.Collection("Member_Videos");
Member_Videos.attachSchema(Schemas.Member_Videos);

Member_Pictures = Collections.Member_Pictures = new Mongo.Collection("Member_Pictures");
Member_Pictures.attachSchema(Schemas.Member_Pictures);

Member_Reviews = Collections.Member_Reviews = new Mongo.Collection("Member_Reviews");
Member_Reviews.attachSchema(Schemas.Member_Reviews);


