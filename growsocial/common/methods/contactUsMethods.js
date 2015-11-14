Meteor.methods({
  addContactUsMessage: function(message) {
    ContactUsMessages.insert({
      name: message.name,
      email: message.email,
      zip: message.zip,
      text: message.text,
      createdAt: new Date(),
      authorId: Meteor.userId(), // can be null, meaning a message from someone not logged in
    });
  },
});
