Meteor.methods({
  addContactUsMessage: function(message, callback) {
    
    ContactUsMessages.insert({
      name: message.name,
      email: message.email,
      zip: message.zip,
      text: message.text,
      createdAt: new Date(),
      authorId: Meteor.userId(), // can be null, meaning a message from someone not logged in
    }, function(err) {
      
      if (err) {
        console.log("ContactUsMessages.insert error: ", err);
        Meteor.call('addErrorLog', {
          tag: 'ContactUsMessages.insert',
          message: err.message + ', message: ' + EJSON.stringify(message).substring(1,300),
        });
        callback && callback(err); // error response to client
        
      } else { // no err
        
        // send an email to ourselves containing the message
        var text = 'name: ' + message.name + 
          '\nemail: ' + message.email +
          '\nzip: ' + message.zip +
          '\ntext: ' + message.text;
        var email = {
          to: "GrowSocial Pilot Coordinator <growsocial.org@gmail.com>",
          from: "GrowSocial Pilot Website <email@growsocial.org>",
          subject: "GrowSocial pilot message - Contact Us",
          text: text,
        };
        // no need to take handle email errors here
        Meteor.call('sendEmail', email);
        callback && callback(); // positive response to client
      }
    });
  },
});
