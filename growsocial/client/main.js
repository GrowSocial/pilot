Session.setDefault('sunbeamBackground', false);
Session.setDefault('notificationCount', 4);

Meteor.setInterval(function(){
  var c = Math.floor(13 * Random.fraction() - 3);
  if (c > 0 ) {
    Session.set('notificationCount', c);
  } else {
    Session.set('notificationCount', "");
  }
}, 5000);

Template.navNotifyCount.helpers({
  notifyCount: function () {
    return Session.get('notificationCount');
  },
});

Template.navNotificationsList.helpers({
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

Template.navConnection.helpers({
  connectionStatus: function () {
    return Meteor.status();
  },
});

Template.navToggleBackground.events({
  'click #toggleBackground': function (event) {
    switchBackground();
  },
});

Template.navLogout.events({
  // TODO error handling on logout
  'click': function (event) {
    Accounts.logout();
  },
});
 
function switchBackground() {
  if (Session.get('sunbeamBackground')) {
    $("#background").css("background-image", "url('/images/garden.jpg')");
    $("#background").css("opacity", 0.2);
    $("#background").css("filter", "alpha(opacity=20)"); // TODO test on IE8
    // $(window).resize(); // TODO is resize needed?
    Session.set('sunbeamBackground', false);
  } else {
    $("#background").css("background-image", "url('/images/sunbeams.png')");
    $("#background").css("opacity", 1.0);
    $("#background").css("filter", "alpha(opacity=100)"); // TODO test on IE8
    // $(window).resize(); // TODO is resize needed?
    Session.set('sunbeamBackground', true);
  }
};
