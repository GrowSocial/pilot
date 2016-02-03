Template.people.helpers({

/* for loading the list of 
   profile collections from DB for viewing by logged-in member.
*/
  people: function () {
    return People.find({},{sort: {lastname: 1, firstname: 1}});
  },
  notAdmin: function(person) {
    return (person.member_key != 'pseudo_0');
  },

/*  
  used to convey which profile is selected, to profile.html
  */
  pathForProfile: function(person) {
    var params = {
      personId: person.member_key
    };
    var path = FlowRouter.path("profile", params);
    return path;
  }

});
