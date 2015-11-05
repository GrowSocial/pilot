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

FlowRouter.route('/people', {
  action: function() {
    BlazeLayout.render("main", {content: "people"});
  },
  name: "people"
});

FlowRouter.route('/profile', {
  action: function() {
    BlazeLayout.render("main", {content: "profile"});
  },
  name: "profile"
});

FlowRouter.route('/businesses', {
  action: function() {
    BlazeLayout.render("main", {content: "businesses"});
  },
  name: "businesses"
});

FlowRouter.route('/business', {
  action: function() {
    BlazeLayout.render("main", {content: "business"});
  },
  name: "business"
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
