// TODO these events no longer needed
Template.leafButtons.events({
  'click button': function (event) {
    if (event.target.id === "myProfileButton") {
      FlowRouter.go("/memberProfile");
    } else if (event.target.id === "membersButton") {
      FlowRouter.go("/memberProfile");
    } else if (event.target.id === "localBusinessButton") {
      FlowRouter.go("/localBusiness");
    }
  }
});

$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});


Template.homeNew.onRendered(function() {
    $('[data-toggle="popover"]').popover(); 
});

Template.homeNew.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});


Template.helpMain.onDestroyed(function() {
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
});