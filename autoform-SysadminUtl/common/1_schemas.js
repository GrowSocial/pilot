Schemas = {};

Meteor.isClient && Template.registerHelper("Schemas", Schemas);


Schemas.Person = new SimpleSchema({
  email: {type: String, index: 1,   unique: true },
  firstName: { type: String, optional: true},
  lastName: { type: String, optional: true},
  street: {type: String, optional: true },
  street2: {type: String, optional: true },
  city: { type: String, optional: true },
  
  state: { type: String, optional: true ,
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: { afFieldInput: { firstOption: "(Select a State)"  } }
  },
  zipcode: {type: String, optional: true }

});

Schemas.Biz = new SimpleSchema({
  bizEmail: {type: String, index: 1,   unique: true },
    bizName: { type: String, optional: true},
   principalName: { type: String, optional: true},
  officeStreet: {type: String, optional: true },
  officeStreet2: {type: String, optional: true },
 officeCity: { type: String, optional: true },
 officeState: { type: String, optional: true ,
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: { afFieldInput: { firstOption: "(Select a State)"  } }
  },
 officeZipcode: {type: String, optional: true },
 officePhone:{type: String, optional: true }

});



