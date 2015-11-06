Template.people.helpers({
  // TODO pull list of people from database
  peopleList: [{
      personId: 1,
      pic: "beagle.jpg",
      name: "Jane",
    }, 
    {
      personId: 2,
      pic: "turkey.jpg",
      name: "Mary",
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
