Template.homeNew.onRendered(function() {
    $('[data-toggle="popover"]').popover(); 
});

Template.homeNew.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});


Template.homeNew.helpers({
  pathForProfile: function() {
    var params = {
      personId: Meteor.userId(),
    };
    var path = FlowRouter.path("profile", params);
    return path;
  },
  pickMemberImage: function() {
    return Random.choice([
      "/images/member_image_block1.jpg",
      "/images/member_image_block2.png",
      "/images/member_image_block3.jpg",
    ]);
  },
});

