Template.profile.helpers({
  person: function() {
    // TODO why is this function run 4 times?
    var personId = FlowRouter.getParam("personId");
    console.log("This is my profile: ", personId);
    // TODO retrieve person details from collection
    if (personId == 1) {
      return {
        personId: personId,
        name: "Jane",
        pic: "/images/user-images/profile-jane.jpg",
        coverPhoto: "/images/user-images/cover-jane.jpg",
        rolesShort: "Grape Picker",
        rolesFull: "Grape Picker",
        location: "Miami, FL",
        };
    } else {
      return {
        personId: personId,
        name: "Anthony",
        pic: "/images/user-images/profile-anthony.jpg",
        coverPhoto: "/images/user-images/cover-anthony.jpg",
        rolesShort: "Farmer, Beekeeper,",
        rolesFull: "Farmer, Beekeeper, Beechaser, Beefinder, Beefeater",
        location: "Fort Lauderdale, FL",
        };
    };
  },
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
  },
});
