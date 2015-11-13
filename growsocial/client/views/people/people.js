Template.people.helpers({
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
