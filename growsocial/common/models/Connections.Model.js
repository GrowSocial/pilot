Connections = new Mongo.Collection("Connections");
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);
/* 
  **********************************************************************  
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);


*/

 Schemas.connectRec = new SimpleSchema({
         member_key:{ type: String,index: 1},
             contact: { type: Array,    optional: false  },    
               'contact.$': { type: Object  },
     'contact.$.member_id': { type: String , optional:false},
    'contact.$.timestamp': {type: Date, optional:true },
    'contact.$.descript': {type: String, optional:true },
});
Connections.attachSchema(Schemas.connectRec);


/*

MarketItems2 = new Mongo.Collection("MarketItems2");
 
 Schemas.MarketItems2 = new SimpleSchema({
         member_key:{ type: String,index: 1},

             items: { type: Array,    optional: false  },    
               'items.$': { type: Object  },
     'items.$.productId': { type: String , optional:true},
          'items.$.member_id': { type: String , optional:true},
   'items.$.description': { type: String , optional:true},
          'items.$.type': { type: String , optional:true },
    'items.$.salesAlert': { type: String , optional:true },
      'items.$.unitType': { type: String , optional:true },
     'items.$.unitPrice': { type: Number , optional:true, decimal: true },
      'items.$.currency': { type: String , optional:true },
         'items.$.photo': { type: Object , optional:true },  // url
           'items.$.pic': { type: String , optional:true },
  'items.$.date_entered': { type: Date, optional:true},
});
MarketItems2.attachSchema(Schemas.MarketItems2);
*/