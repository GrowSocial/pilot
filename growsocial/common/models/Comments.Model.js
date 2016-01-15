Comments = new Mongo.Collection("Comments");

/* 
  **********************************************************************  */
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);

Schemas.comment = new SimpleSchema({
member_key:{ type: String,index: 1,optional: false },
commentBy:{ type: String, optional: false },
comment:{ type: String, optional: false },
timestamp:{ type: Date, optional: false },
commentSource:{ type: String, optional: false },

});

Comments.attachSchema(Schemas.comment);


