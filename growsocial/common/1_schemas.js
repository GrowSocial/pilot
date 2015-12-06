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
   'items.$.unitPrice': {    type: Number , optional:true },
    'items.$.currency': {    type: String , optional:true },
    'items.$.photo': {       type: Object , optional:true }
});

Schemas.Member_Reviews = new SimpleSchema({
member_key:{ type: String,index: 1},
review_by:{ type: String, optional: true },
review_date:{ type: Date, optional: true },
review_text:{ type: String, optional: true },
review_rating:{ type: Number, optional: true },

});

Schemas.Member_Pictures = new SimpleSchema({
  member_key: { type: String, index: 1},
  submission_date: { type: Date, optional: true },
  album: {type: String, optional: true},
  caption: {type:String,optional:true},
  picture: {type: Object, optional:true }
});

Schemas.Member_Videos = new SimpleSchema({
  member_key: { type: String, index: 1},
  submission_date: { type: String, optional: true },
  album: {type: String, optional: true},
  caption: {type:String,optional:true},
  video: {type: Object, optional: true }
});


Schemas.Person = new SimpleSchema({
  member_key: {type: String, index: 1,  unique: true },
  email: {     type: String, optional: false,  unique: true },
  firstname: { type: String, optional: true},
  lastname: {  type: String, optional: true},
  fullname: {  type: String, optional: true},
  street: {    type: String, optional: true},
  street2: {   type: String, optional: true},
  city: {      type: String, optional: true},
  state: {     type: String, optional: true ,
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL",
    "GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA",
    "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
    "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA",
    "WA","WV","WI","WY"],
    autoform: { afFieldInput: { firstOption: "(Select a State)"  } }
    },
  zipcode: {type: String, optional: true },
  occupations: {  type: Array,    optional: true  },    
        'occupations.$': {       type: Object  },
        'occupations.$.vocation': {type: String },
        'occupations.$.descript': {type: String, optional:true },
  location:{   type: String,   optional: true },
  phone:{      type: String,   optional: true },
  website:{    type: String,   optional: true },
  links:{      type: String,   optional: true },
  facebookID:{ type: String,   optional: true },
  twitterID:{  type: String,   optional: true },
  instagramID:{type: String,   optional: true },
  about:{      type: String,   optional: true }
});


