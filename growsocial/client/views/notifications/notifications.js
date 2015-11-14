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

Template.notifications.helpers({
  // TODO pull notifications from database
  notificationList: [{
      pic: "/images/user-images/profile-anthony.jpg",
      message: "Anthony's beefsteak tomato is sold out.",
    }, {
      pic: "/images/user-images/profile-mary.jpg",
      message: "Mary sent you a message.",
    }, {
      pic: "/images/user-images/event-volunteerday.jpg",
      message: "Reminder: Community garden volunteer day tomorrow.",
    }, {
      pic: "/images/user-images/profile-anthony.jpg",
      message: "Anthony sent you a message.",
    }, 
  ],
});
