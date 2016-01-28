Connections = new Mongo.Collection("Connections");
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);
/* 
  **********************************************************************  
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);


FIRST MODEL::(preferred)  But not able to impliment as of Jan 2016, and replacing with 
alternate version below.. /TEC

 Schemas.connectRec = new SimpleSchema({
         member_key:{ type: String,index: 1},
             contact: { type: Array,    optional: false  },    
               'contact.$': { type: Object  },
     'contact.$.member_id': { type: String , optional:false},
    'contact.$.timestamp': {type: Date, optional:true },
    'contact.$.descript': {type: String, optional:true },
});

*/

 Schemas.connectRec = new SimpleSchema({
         member_key:{type: String,index: 1,optional: false },
            contact:{type: String, optional:false},
          timestamp:{type: Date, optional:false },
           descript:{type: String, optional:false },
});
Connections.attachSchema(Schemas.connectRec);

