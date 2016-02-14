// TODO only load tawkto if production 
Meteor.startup(function() {

  return; // dont load tawkto at all, until we are ready to offer support

  // TODO dont have to load env each time, can store it in session?
  Meteor.call("getEnv", function(error, result) {
    if (error) {
      // abort abort, we don't have env ready?
      console.log('error from getEnv: ', error);
    } else {
      if (result.NODE_ENV != "production") {
        return;
      }
    }

    // <!--Start of Tawk.to Script-->
    // <script type="text/javascript">
    // var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
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

  });
});

// clear or show the tawk widget
function showTawk(toShow, countdown, foundTawk) {
  if (countdown < 0) return;
  if (typeof(Tawk_API) != "undefined" && Tawk_API.toggle) {
    if (toShow) {
      Tawk_API.toggle();
      Tawk_API.toggle();
      Tawk_API.showWidget();
      Tawk_API.showWidget();
    } else {
      Tawk_API.hideWidget();
      Tawk_API.hideWidget();
    }
    if (!foundTawk) {  // do yet another delay and another attempt
      Meteor.setTimeout(function() {
        showTawk(toShow, countdown-1, true);
      }, 600);
    }
  } else {
    Meteor.setTimeout(function() {
      showTawk(toShow, countdown-1, false);
    }, 300);
  }
}

// Only show tawk chat when route is "help"
// TODO make this configurable per user Settings
/* 
Meteor.startup(function() {
  Meteor.autorun(function() {
    var routeName = FlowRouter.getRouteName(); // reactive
    if (routeName === "help") {
      showTawk(true, 1000);
    } else {
      showTawk(false, 1000);
    }
  });
});
 */

Session.setDefault('backgroundMainStyle1', true);
// Session.setDefault('notificationCount', 4);
/* 
Meteor.setInterval(function(){
  var c = Math.floor(13 * Random.fraction() - 3);
  if (c > 0 ) {
    Session.set('notificationCount', c);
  } else {
    Session.set('notificationCount', "");
  }
}, 5000);
 */

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
  notificationList: function() {
    // relies on the published messages filtering by targetUserId = this userId
    return Notifications.find({}, {sort: {dateTime: -1}, limit: 4});
  },
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

// Disable nav search input and button when route is search
Template.main.onRendered(function() {
  this.autorun(function() {
    var routeName = FlowRouter.getRouteName(); // reactive
    if (routeName === "search") {
      // clear and disable search input and button
      $('#navSearchText').val("");
      $('#navSearchText').attr('disabled','disabled');
      $('.navSearchButton').attr('disabled','disabled');
    } else {
      $('#navSearchText').attr('disabled', null);
      $('.navSearchButton').attr('disabled', null);
    }
  });
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
