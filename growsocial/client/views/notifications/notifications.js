Template.notifications.onCreated(function() {
  var self = this;

  // this will rerun if meteor user changes
  this.autorun(function() {
    // No point showing notifications when not logged in
    if (!Meteor.user()) {
        FlowRouter.go("home");
    };
  });
});
