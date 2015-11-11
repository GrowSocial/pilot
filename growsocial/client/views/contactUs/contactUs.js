Template.contactUsMessageList.helpers({
  contactUsMessages: function() {
    return ContactUsMessages.find();
  },
});

Template.contactUs.onRendered(function () {
  // TODO make reactive based on Meteor.user()
  if (Meteor.user()) {
    // Set on-screen email address to same as logged-in user
    $('#email').val(Meteor.user().emails[0].address);
  } else {
    $('#email').val("");
  };
});

Template.contactUs.events({
  'submit #contact-us-form': function (event) {
    event.preventDefault();
    console.log("submit contact-us-form, event: ", event);

    $('#button-submit').text("Submitting message...");
    $('#button-submit').prop( "disabled", true );
    
    var text = $('#message').val();
    Meteor.call("addContactUsMessage", text);
    return false;
  }
});
