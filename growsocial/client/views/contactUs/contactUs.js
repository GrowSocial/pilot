Template.contactUsMessageList.helpers({
  contactUsMessages: function() {
    return ContactUsMessages.find({}, {sort: {createdAt: -1}});
  },
  someDate: function() {
    return moment(Template.currentData().createdAt).format('YYYY-MMM-DD HH:mm:ss');
  },
});

Template.contactUs.onRendered(function () {
  // TODO why are the forms clearing on refresh page?
  // TODO make reactive based on Meteor.user(), so a logout action causes a clearing of email and other default values?
  if (Meteor.user()) {
    // Set on-screen email address to same as logged-in user
    // TODO pick an "active" email address rather than just the first email address
    // TODO pick from People collection rather than Meteor.user
    // TODO pick zip from People collection
    $('#email').val(Meteor.user().emails[0].address);
    if (!!Meteor.user().profile & !!Meteor.user().profile.firstname) {
      $('#name').val(Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname);
    }
  } else {
    $('#name').val("");
    $('#email').val("");
  };
});

Template.contactUs.events({
  'submit #contact-us-form': function (event) {
    event.preventDefault();
    // console.log("submit contact-us-form, event: ", event);

    $('#button-submit').text("Submitting message...");
    $('#button-submit').prop( "disabled", true );

    // TODO alter visible styling on disabled button
    
    var message = {
      name: event.target.name.value,  // alternative: $('#name').val()
      email: event.target.email.value,
      zip: event.target.zip.value,
      text: event.target.message.value,
    };
    Meteor.call("addContactUsMessage", message, function(error, result) {
      if (error) {
        $('#button-submit').text("Submission error, retry");
      } else {
        event.target.message.value = "";
        $('#button-submit').text("Message submitted. Send another?");
      }
      $('#button-submit').prop( "disabled", false );
    });
    return false;
  }
});
