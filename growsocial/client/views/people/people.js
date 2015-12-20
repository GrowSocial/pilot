Template.people.helpers({


/* for loading the list of 
   profile collections from DB for viewing by logged-in member.
*/
people: function () { return People.find();
},

notAdmin: function(){ var Iam = this.member_key; //alert('people test '+ Iam);
if (Iam == 'pseudo_0') { return false } else { return true;}
},

/*  
  used to convey which profile is selected, to profile.html
  */
  pathForProfile: function() {
    var person = this;
    var params = {
      personId: person.member_key //personId: person.personId
    };
    var path = FlowRouter.path("profile", params);
    return path;
  }


/*
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
*/



  
});
