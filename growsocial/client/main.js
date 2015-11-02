Session.setDefault('sunbeamBackground', false);

Template.navToggleBackground.events({
  'click #toggleBackground': function (event) {
    switchBackground();
  },
});

function switchBackground() {
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
};
