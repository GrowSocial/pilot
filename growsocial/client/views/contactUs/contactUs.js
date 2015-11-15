Template.contactUsMessageList.helpers({
  contactUsMessages: function() {
    return ContactUsMessages.find();
  },
});

Template.contactUs.onRendered(function () {
  // TODO make reactive based on Meteor.user(), so a logout action causes a clearing of email and other default values?
  if (Meteor.user()) {
    // Set on-screen email address to same as logged-in user
    // TODO pick an "active" email address rather than just the first email address
    $('#email').val(Meteor.user().emails[0].address);
  } else {
    $('#email').val("");
  };
});

Template.contactUs.events({
  'submit #contact-us-form': function (event) {
    event.preventDefault();
    console.log("submit contact-us-form, event: ", event);

    Template.contactUs.mishaEvent = event;
    
    $('#button-submit').text("Submitting message...");
    $('#button-submit').prop( "disabled", true );

    // TODO let user know message stored.
    // TODO re-enable button once message stored.
    
    var message = {
      name: event.target.name.value,  // alternative: $('#name').val()
      email: event.target.email.value,
      zip: event.target.zip.value,
      text: event.target.message.value,
    };
    Meteor.call("addContactUsMessage", message);
    return false;
  }
});
