Template.people.helpers({

  exampleDoc: function () {
    return PeopleWithContacts.findOne({firstName: 'Albert'});
  },



/* Introduce People collection; 
   Helper 'people:' to be called by 'people.html', for loading the list of 
   profile collections from DB for viewing by logged-in member.

*/
  people: function () { return People.find();
  },



  // TODO pull list of people from database
  peopleList: [{
      personId: 1,
      pic: "/images/user-images/profile-jane.jpg",
      name: "Jane",
    }, 
    {
      personId: 2,
      pic: "/images/user-images/profile-anthony.jpg",
      name: "Anthony",
    },
  ],

/*  
  used to convey which profile is selected, to profile.html
  */
  pathForProfile: function() {
    var person = this;
    var params = {
      personId: person.member_key //personId: person.personId
    };
    var path = FlowRouter.path("profile", params);
    //alert(person.email);
    return path;
  }
  //profilekey: function() { var person = this; return person.member_key;}

});
