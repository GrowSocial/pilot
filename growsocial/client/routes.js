// kadira:flow-router
// guide: https://kadira.io/academy/meteor-routing-guide/content/rendering-blaze-templates
// naming each route helps in using "isActiveRoute"

FlowRouter.route('/', {
  name: "home",
  action: function() {
    BlazeLayout.render("main", {content: "home"});
  },
});

FlowRouter.route('/people/', {
  name: "people",
  action: function() {
    BlazeLayout.render("main", {content: "people"});
  },
});

FlowRouter.route('/profile/:personId', {
  name: "profile",
  action: function(params) {
    console.log("This is my profile: ", params.personId);
    BlazeLayout.render("main", {content: "profile"});
  },
});

FlowRouter.route('/businesses', {
  name: "businesses",
  action: function() {
    BlazeLayout.render("main", {content: "businesses"});
  },
});

FlowRouter.route('/business/:businessId', {
  name: "business",
  action: function(params) {
    BlazeLayout.render("main", {content: "business"});
  },
});

FlowRouter.route('/marketplace/:productId', {
  name: "marketplace",
  action: function(params) {
    BlazeLayout.render("main", {content: "marketplace"});
  },
});

FlowRouter.route('/notifications', {
  name: "notifications",
  action: function() {
    BlazeLayout.render("main", {content: "notifications"});
  },
});

FlowRouter.route('/contactUs', {
  name: "contactUs",
  action: function() {
    BlazeLayout.render("main", {content: "contactUs"});
  },
});

FlowRouter.route('/help', {
  name: "help",
  action: function() {
    BlazeLayout.render("main", {content: "help"});
  },
});

FlowRouter.route('/localpedia', {
  name: "localpedia",
  action: function() {
    BlazeLayout.render("main", {content: "localpedia"});
  },
});

FlowRouter.route('/login', {
  name: "login",
  action: function() {
    BlazeLayout.render("main", {content: "login"});
  },
});

FlowRouter.route('/logout', {
  name: "logout",
  action: function() {
    // TODO error handling on logout
    Accounts.logout();
    BlazeLayout.render("main", {content: "home"});
  },
});

FlowRouter.route('/register', {
  name: "register",
  action: function() {
    BlazeLayout.render("main", {content: "register"});
  },
});

FlowRouter.route('/forgotPassword', {
  name: "forgotPassword",
  action: function() {
    BlazeLayout.render("main", {content: "forgotPassword"});
  },
});

FlowRouter.route('/changePassword', {
  name: "changePassword",
  action: function() {
    BlazeLayout.render("main", {content: "changePassword"});
  },
});
