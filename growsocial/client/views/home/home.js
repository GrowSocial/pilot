// TODO these events no longer needed
Template.leafButtons.events({
  'click button': function (event) {
    if (event.target.id === "myProfileButton") {
      FlowRouter.go("/memberProfile");
    } else if (event.target.id === "membersButton") {
      FlowRouter.go("/memberProfile");
    } else if (event.target.id === "localBusinessButton") {
      FlowRouter.go("/localBusiness");
    }
  }
});

