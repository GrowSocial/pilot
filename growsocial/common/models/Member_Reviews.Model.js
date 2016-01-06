
Member_Reviews = new Mongo.Collection("Member_Reviews");

/* 
  **********************************************************************  */
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);

Schemas.Member_Reviews = new SimpleSchema({
member_key:{ type: String,index: 1},
review_by:{ type: String, optional: true },
review_date:{ type: Date, optional: true },
review_text:{ type: String, optional: true },
review_rating:{ type: Number, optional: true },
});

Member_Reviews.attachSchema(Schemas.Member_Reviews);




