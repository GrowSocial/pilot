MarketItems = new Mongo.Collection("MarketItems");
 
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);
 Schemas.MarketItems = new SimpleSchema({
         vendor_key:{ type: String,index: 1},
      vendorUserId: { type: String, optional:true },
  vendorBusinessId: { type: String, optional:true },
        vendorLink: { type: String, optional:true },
        vendorName: { type: String, optional:true },
       vendorEmail: { type: String, optional:true },
    testDataMarket: { type: Boolean, optional:true },
             items: { type: Array,    optional: false  },    
               'items.$': { type: Object  },
     'items.$.productId': { type: String , optional:true},
          'items.$.name': { type: String , optional:false},
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
MarketItems.attachSchema(Schemas.MarketItems);
