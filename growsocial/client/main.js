Session.setDefault('sunbeamBackground', false);

Template.diagnostic.events({
  'click button': function (event) {
    if (Session.get('sunbeamBackground')) {
      $("#background").css("background-image", "url('images/garden.jpg')");
      $("#background").css("opacity", 0.2);
      $("#background").css("filter", "alpha(opacity=20)"); // TODO test on IE8
      // $(window).resize(); // TODO is resize needed?
      Session.set('sunbeamBackground', false);
    } else {
      $("#background").css("background-image", "url('images/sunbeams.png')");
      $("#background").css("opacity", 1.0);
      $("#background").css("filter", "alpha(opacity=100)"); // TODO test on IE8
      // $(window).resize(); // TODO is resize needed?
      Session.set('sunbeamBackground', true);
    }
  }
});

Template.navItems.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
      template === currentRoute.lookupTemplate() ? 'active' : '';
  },
});

