MarketItems = new Mongo.Collection("MarketItems");

 
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);
 Schemas.MarketItems = new SimpleSchema({
  vendor_key:{ type: String,index: 1},
  items: {  type: Array,    optional: false  },    
   'items.$': {    type: Object  },
   'items.$.description': {  type: String , optional:false},
   'items.$.type': {         type: String , optional:true },
   'items.$.salesAlert': {   type: String , optional:true },
   'items.$.unitType': {     type: String , optional:true },
   'items.$.unitPrice': {    type: Number , optional:true, decimal: true },
    'items.$.currency': {    type: String , optional:true },
    'items.$.photo': {       type: Object , optional:true }
});
MarketItems.attachSchema(Schemas.MarketItems);





