Template.leafButtons.helpers({
  leafPushed: function () {
    return Session.get('leafPushed');
  }
});

Template.leafButtons.events({
  'click button': function (event) {
    // Session.set('leafPushed', event.target.id);
    console.log('leafButtons click button: ', event.target.id);
    if (event.target.id === "membersButton") {
      Router.go("/memberProfile");
    } else if (event.target.id === "localBusinessButton") {
      Router.go("/localBusiness");
    }
  }
});

