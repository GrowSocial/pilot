// kadira:flow-router
// guide: https://kadira.io/academy/meteor-routing-guide/content/rendering-blaze-templates
// naming each route helps in using "isActiveRoute"

// TODO not allow access to some pages if not logged in, like my profile, notifications.

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("main", {content: "home"});
  },
  name: "home"
});

FlowRouter.route('/memberProfile', {
  action: function() {
    BlazeLayout.render("main", {content: "memberProfile"});
  },
  name: "memberProfile"
});

FlowRouter.route('/localBusiness', {
  action: function() {
    BlazeLayout.render("main", {content: "localBusiness"});
  },
  name: "localBusiness"
});

FlowRouter.route('/notifications', {
  action: function() {
    BlazeLayout.render("main", {content: "notifications"});
  },
  name: "notifications"
});

FlowRouter.route('/contactUs', {
  action: function() {
    BlazeLayout.render("main", {content: "contactUs"});
  },
  name: "contactUs"
});

FlowRouter.route('/help', {
  action: function() {
    BlazeLayout.render("main", {content: "help"});
  },
  name: "help"
});

FlowRouter.route('/localpedia', {
  action: function() {
    BlazeLayout.render("main", {content: "localpedia"});
  },
  name: "localpedia"
});
