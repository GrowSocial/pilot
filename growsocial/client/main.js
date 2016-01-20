// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/569317501df5fe345b098dc2/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
// </script>
// <!--End of Tawk.to Script-->

Session.setDefault('backgroundMainStyle1', true);
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
    // return Session.get('notificationCount');
    var c = Notifications.find().count();
    if (c > 0) {
      return c;
    } else {
      return '';
    }
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

Template.navSearchForm.events({
  'submit': function (event) {
    // Prevent browser from restarting
    event.preventDefault();
    var queryParams = {};
    // search text into queryParams
    var text = event.target.navSearchText.value;
    if (text) queryParams['q'] = text;
    // pass search the context of which screen is on before searching
    if (FlowRouter.current().route.name != "search") queryParams['p'] = FlowRouter.current().route.name;
    FlowRouter.go("search", {}, queryParams);
    return false; // Prevent default form submit
  },
});

Template.navProfilePic.helpers({
  pathForProfile: function() {
    var params = {
      personId: Meteor.userId(),
    };
    var path = FlowRouter.path("profile", params);
    return path;
  },
});
 
function switchBackground() {
  if (Session.get('backgroundMainStyle1')) {
    $("#backgroundMain").removeClass("backgroundMainStyle1").addClass("backgroundMainStyle2");
    // $(window).resize(); // TODO is resize needed?
    Session.set('backgroundMainStyle1', false);
  } else {
    $("#backgroundMain").removeClass("backgroundMainStyle2").addClass("backgroundMainStyle1");
    // $(window).resize(); // TODO is resize needed?
    Session.set('backgroundMainStyle1', true);
  }
};
