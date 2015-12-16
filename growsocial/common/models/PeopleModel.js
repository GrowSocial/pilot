
People = new Mongo.Collection('People');

/* schemas not implimented yet, but confirming code can be located here , 
  to test as working once collectionsTest_02 is integrated with pilot app 
  **********************************************************************  */
Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);
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




People.remove({});
var sData = [
{
member_key: 'pseudo_3', 
email: 'deep-end@me.com',
firstname:'Arthur',
lastname: 'Stripe',
fullname:'Arthur Stripe',
    street:'89 Higherstill Dr.', 
    street2:'',
    city:'Micanopy',
    state:'FL',
  zipcode:'34000',
  occupations: [ {vocation: 'Carpenter', descript:'Journeyman'},    
                 {vocation: 'Aquaponics',descript:'Designer'}               
               ],  
  location:'North Florida, FL',
  phone:'704 999-0100',
  website:'www.buildaquaponics.com',
  links:'gg.Aquaponics-today.rr{',
  facebookID:'',
  twitterID:'@artaqua',
  instagramID:'',
  about:'Fishes in yer tank, closed cycle!'
},

{
member_key: 'pseudo_2',
email: 'jessie@me.com',
firstname:'Jessica',
lastname: 'Jones',
fullname:'Jessica Jones',
occupations: [  {vocation: 'Owner', descript: 'Om Wellness Center'},    
                {vocation: 'Yoga Instructor'},   
                {vocation: 'Massage Therapist', descript:'LMT'}
              ],
 location:'Sunrise, FL',
 zipcode:'39000',
 about:'~ Whynot doYoga!'
},

{
member_key: 'pseudo_1', 
email: 'tony@me.com',
firstname:'Anthony',
lastname: 'Anderson',
fullname:'Anthony Anderson',
    street:'89 High Cliff Dr.', 
    street2:'',
    city:'Ft. Lauderdale',
    state:'FL',
  zipcode:'39000',
  occupations: [ {vocation: 'Farmer', descript: ''},    
                 {vocation: 'Beekeeper'},   
                 {vocation: 'Massage Therapist', descript: '(self taught)'}
           ],  
  location:'Ft. Lauderdale, FL',
  phone:'704 999-0000',
  website:'www.tonyAfarmer.com',
  links:'gg.web.hot.blog{',
  facebookID:'',
  twitterID:'@tonyA',
  instagramID:'',
  about:'Natural farming, baby!'
}
];


if (People.find().count() === 0) {
    _.each(sData, function(sItem)  
      { People.insert(sItem);}   );
}


/*  concept for test specific records present or not -- useful for reset seed datasets
 _.each(sData, 
        function(sItem) {
          var d = sData[0]; //entire document
          console.log(d.slice(13,8)); //portion containing the member_key datum
                        if ( People.find({member_key: d}).count() === 0 ) 
                             { People.insert(sItem); }

                        }
        );
*/





