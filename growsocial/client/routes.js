// kadira:flow-router
// guide: https://kadira.io/academy/meteor-routing-guide/content/rendering-blaze-templates
// naming each route helps in using "isActiveRoute"

FlowRouter.notFound = {
  name: "notFound",
  action: function() {
    BlazeLayout.render("main", {content: "notFound"});
  },
};

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
    // console.log("This is my profile: ", params.personId);
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

// '/marketplace/:productId'
FlowRouter.route('/marketplace', {
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
    // No longer redirecting to contactUs to take no new accounts
    // FlowRouter.redirect("/contactUs");
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

FlowRouter.route('/cart', {
  name: "cart",
  action: function() {
    BlazeLayout.render("main", {content: "cart"});
  },
});

// FlowRouter.route('/search/:searchOption?', {
FlowRouter.route('/search', {
  name: "search",
  action: function(params, queryParams) {
    BlazeLayout.render("main", {content: "search"});
  },
});

FlowRouter.route('/discuss', {
  name: "discuss",
  action: function() {
    BlazeLayout.render("main", {content: "discuss"});
  },
});

FlowRouter.route('/location', {
  name: "location",
  action: function() {
    BlazeLayout.render("main", {content: "location"});
  },
});

FlowRouter.route('/tutorials', {
  name: "tutorials",
  action: function() {
    BlazeLayout.render("main", {content: "tutorials"});
  },
});

FlowRouter.route('/story', {
  name: "story",
  action: function() {
    BlazeLayout.render("main", {content: "story"});
  },
});

FlowRouter.route('/settings', {
  name: "settings",
  action: function() {
    BlazeLayout.render("main", {content: "settings"});
  },
});

FlowRouter.route('/uploads', {
  name: "uploads",
  action: function() {
    BlazeLayout.render("main", {content: "uploads"});
  },
});

FlowRouter.route('/store', {
  name: "store",
  action: function() {
    BlazeLayout.render("main", {content: "store"});
  },
});
