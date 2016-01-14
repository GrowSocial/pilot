Meteor.methods({
  // TODO limit how many sent per period per type
  // TODO !!!!!!!! generic sendMail method not to be accessible from client !!!!!!!!
  //         have it as a server function, and called by various server activities:
  //          shopping cart, contactUs, etc.
  
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
      return;
    }
    // Catch, report, and rethrow errors
    catch(err) {
      console.log("Email.send error: ", err);
      console.log("Email that was attempted: ", email);
      Meteor.call('addErrorLog', {
        tag: 'sendEmail',
        message: err.message + ', mail: ' + EJSON.stringify(email)
      });
      throw(err);
    }
  }
});
