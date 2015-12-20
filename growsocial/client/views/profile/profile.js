
Template.profile.onCreated(function() { var self = this;
  self.autorun(function() { var member_Key = FlowRouter.getParam('personId');
  self.subscribe('oneProfileRec', member_Key); 
  //alert('Template.profile.onCreated('+ member_Key); 
  });
});

Template.profile.helpers({

    selectProfile: function() {
    var mKey = FlowRouter.getParam('personId');
    var member = People.findOne({member_key: mKey}) || {};
    //alert('Template.profile.helpers('+ mKey);
    return member;
  },

/*
    // TODO retrieve person details from collection
    if (personId == 1) {
      return {
        personId: personId,
        name: "Jane",
        pic: "/images/user-images/jane.png",
        coverPhoto: "/images/newsfeed-hdr1366-192.jpg",
        rolesShort: "Grape Picker",
        rolesFull: "Grape Picker",
        location: "Miami, FL",
        };
    } else {
      return {
        personId: personId,
        name: "Anyone at all",
        pic: "/images/user-images/anthony.jpg",
        coverPhoto: "/images/user-images/owl.jpg",
        rolesShort: "Local Occupation",
        rolesFull: "",
        location: "Yourtown, Earth",
        };
    };

*/


  postList: function() {
    var personId = FlowRouter.getParam("personId");
    // TODO retrieve person details from collection
    if (personId == 2) {
      return [{
          icon: "/images/user-images/profile-anthony.jpg",
          datePosted: "Jan 15",
          message: "Time to grab your shovels, it is composting season!",
        }, {
          icon: "/images/user-images/profile-anthony.jpg",
          datePosted: "Jan 12",
          message: "Beautiful maggots are in my compost bin, I promise to share a pic, yummy.",
        }, 
      ];
    }
  }


});
