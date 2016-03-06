Meteor.methods({
  checkPilotCode: function(pilotCode) {
    if (pilotCode === 'HAPPYPILOT') return true;
    throw new Meteor.Error("pilot-code-wrong", "The Pilot Code was not entered correctly");
  },
});
