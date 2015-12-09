Meteor.methods({
  sendEmail: function (email) {
    //Check to make sure fields are strings
    check([email.to, email.from, email.subject, email.text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    //Send email
    try {
      Email.send({
        to: email.to,
        from: email.from,
        subject: email.subject,
        text: email.text,
      });
    }
    // Catch any errors
    catch(err) {
      console.log("error");
      Meteor.call('addErrorLog', err);
    }
  }
});