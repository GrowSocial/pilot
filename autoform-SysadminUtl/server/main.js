Meteor.startup(function () {
  // fixtures
  if (Items.find().count() === 0) {
    _.each([ "Hat", "Shoes", "Coat",  "Gloves", "Socks", "Sweater",  "T-shirt"], 
    function (name) {   Items.insert({name: name});
    }
    );
    
  }

//Bizness.remove({})
//Bizness.insert({bizEmail: 'bb@moo2.com', bizName: 'BarnNails' });

//alert(Bizness.find().count());

//People.remove({});
//People.insert({email: 'dls@moo2.com', 
//  firstName: 'Benji',lastName: 'Mellon',street:'89 Durango', street2:'',city:'Chisolm',state:'AZ',zip:'07044' });
//People.insert({email: 'dls@moo3.com' , 
//  firstName: 'Barry',lastName: 'Blitz2',   
//    street:'89 Durango', street2:'basement',city:'Chisolm',state:'AZ',zip:'07044' });


//  PeopleWithContacts.remove({});

  // Used for updatepush example
  //PeopleWithContacts.insert({firstName: 'Albert',lastName: 'Einstein',age: new Date().getFullYear() - 1879});

  // Used for updateArrayItem example
  //PeopleWithContacts.insert({ firstName: 'Winston', lastName: 'Churchill', age: new Date().getFullYear() - 1874,
   // contacts: [  {name: 'Randolph Churchill', phone: '+1 555-555-5555'},    {name: 'Jennie Jerome', phone: '+1 555-555-5555'},   {name: 'Clementine Hozier', phone: '+1 555-555-5555'}  ]
  //});


});//Meteor.startup(function ()
