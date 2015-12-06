Template.people.helpers({

/* TEC 
  Attempting to introduce Meteor.People to the app, 
  Helper 'people:' to be called by 'people.html', for loading the list of 
  profile collections from DB for viewing by logged-in member.

  'selectedPersonDoc:' and 'isSelectedPerson:' used to convey which 
  profile is selected, to profile.html
*/
  member: function () { return 
    People.find();
    //People.find({member_key: {$gt: ""}}).fetch();
  },
  selectedPersonDoc: function () {
    return People.findOne(Session.get("selectedPersonId"));
  },
  isSelectedPerson: function () {
    return Session.equals("selectedPersonId", this._id);
  },
/* end ~ helpers added by TEC Dec 2015 *************************/



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
  pathForProfile: function() {
    var person = this;
    var params = {
      personId: person.personId
    };
    var path = FlowRouter.path("profile", params);
    return path;
  }

});
