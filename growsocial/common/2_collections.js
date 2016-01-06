
var Collections = {};

Meteor.isClient && Template.registerHelper("Collections", Collections);


Member_Videos = Collections.Member_Videos = new Mongo.Collection("Member_Videos");
Member_Videos.attachSchema(Schemas.Member_Videos);

Member_Pictures = Collections.Member_Pictures = new Mongo.Collection("Member_Pictures");
Member_Pictures.attachSchema(Schemas.Member_Pictures);




