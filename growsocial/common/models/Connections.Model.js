Connections = new Mongo.Collection("Connections");

/* 
  **********************************************************************  */
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);

Schemas.connection = new SimpleSchema({
member_key:{ type: String,index: 1,optional: false },


connected: {  type: Array,    optional: false  },    
    'connected.$': {       type: Object  },
    'connected.$.member_id': {type: String ,optional:false},
    'connected.$.timestamp': {type: Date, optional:false },
    'connected.$.descript': {type: String, optional:true },

});

Comments.attachSchema(Schemas.comment);


