Schemas = {};

Meteor.isClient && Template.registerHelper("Schemas", Schemas);






Schemas.Member_Videos = new SimpleSchema({
  member_key: { type: String, index: 1},
  submission_date: { type: String, optional: true },
  album: {type: String, optional: true},
  caption: {type:String,optional:true},
  video: {type: Object, optional: true }
});




