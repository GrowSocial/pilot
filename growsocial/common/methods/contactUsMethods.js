Meteor.methods({
  addContactUsMessage: function(text) {
    ContactUsMessages.insert({
      text: text,
      createdAt: new Date(),
      authorId: Meteor.userId(),
    });
  },
});
