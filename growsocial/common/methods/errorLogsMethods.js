Meteor.methods({
  addErrorLog: function(error) {
    ErrorLogs.insert({
      userId: Meteor.userId(), // null if not logged in
      dateTime: new Date(),
      tag: error.tag,
      message: error.message
    });
  },
});
