Template.profile.helpers({
  profile_data: function() {

    // TODO why is this function run 4 times?
    var personId = FlowRouter.getParam("personId");

    //console.log("This is my profile: ", personId);
    //alert( People.findOne({member_key: personId}).count());
    //alert(CollectionName.findOne({_id: documenteId}));
      //alert(People.find({member_key: personId}).count());
      //{fields: {fullname: 1, email: 1, location:1 }}
     //alert(People.find({member_key: personId}));

    //return personId
    return People.find({member_key: personId})

  },


  formData:function(){
    var personId = FlowRouter.getParam("personId");
    alert(personId + People.find({member_key: personId}).count());
    return People.find({member_key: personId});
  }
,


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
  },
});
