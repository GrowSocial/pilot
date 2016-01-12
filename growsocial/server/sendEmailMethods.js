Meteor.methods({
  sendEmail: function (email) {
    //Check to make sure fields are strings
    check([email.to, email.from, email.subject, email.text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    if (Meteor.isServer) {
      //Send email
      try {
        Email.send({
          to: email.to,
          from: email.from,
          subject: email.subject,
          text: email.text,
        });
        console.log("email sent");
      }
      // Catch any errors
      catch(err) {
        console.log("Error: ", err);
        Meteor.call('addErrorLog', {
          tag: 'sendEmail',
          message: err.message
        });
      }
    }
  }
});