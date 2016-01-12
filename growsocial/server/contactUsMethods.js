// TODO feedback to user when message has reached server, not just mini mongo

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
    
    var text = 'name: ' + message.name + 
      '\nemail: ' + message.email +
      '\nzip: ' + message.zip +
      '\ntext: ' + message.text;

    // send an email to ourselves containing the message
    var email = {
      to: "GrowSocial Pilot Coordinator <growsocial.org@gmail.com>",
      from: "GrowSocial Pilot Website <email@growsocial.org>",
      subject: "GrowSocial pilot message - Contact Us",
      text: text,
    };
    // TODO handle errors -> log into database, already done in email function?
    Meteor.call('sendEmail', email, function(error, result) {});

  },
});
