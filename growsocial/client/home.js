Template.leafButtons.events({
  'click button': function (event) {
    if (event.target.id === "myProfileButton") {
      Router.go("/memberProfile");
    } else if (event.target.id === "membersButton") {
      Router.go("/memberProfile");
    } else if (event.target.id === "localBusinessButton") {
      Router.go("/localBusiness");
    }
  }
});

