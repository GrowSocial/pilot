Meteor.methods({
  addContactUsMessage: function(message) {

    try {
      // synchronous (to the server) insert
      ContactUsMessages.insert({
        name: message.name,
        email: message.email,
        zipcode: message.zipcode,
        text: message.text,
        mailinglist: message.mailinglist,
        createdAt: new Date(),
        authorId: Meteor.userId(), // can be null, meaning a message from someone not logged in
      });
      
      // send an email to growsocial containing the message
      var text = 'name: ' + message.name + 
        '\nemail: ' + message.email +
        '\nzipcode: ' + message.zipcode +
        '\nmailing list: ' + (message.mailinglist? 'YES' : 'NO') +
        '\ntext: ' + message.text;
      var email = {
        to: "GrowSocial Pilot Coordinator <growsocial.org@gmail.com>",
        from: "GrowSocial Pilot Website <growsocial.org@gmail.com>",
        subject: "GrowSocial pilot message - Contact Us",
        text: text,
      };
      // no need to do anything with email errors here, so pass empty callback
      Meteor.call('sendEmail', email, function() {});
      return; // undefined, i.e. a positive response to client/caller
      
    } catch (err) {
      console.log('caught err from insert, will add to error log, then rethrow to server & client');
      Meteor.call('addErrorLog', {
        tag: 'ContactUsMessages.insert',
        message: err.message + ', message: ' + EJSON.stringify(message).substring(1,300),
      });
      throw(err);
    }
  },
});
