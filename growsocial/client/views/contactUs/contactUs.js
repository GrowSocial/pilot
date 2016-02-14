Template.contactUs.helpers({
  person: function() {
    return People.findOne({
      member_key: Meteor.userId()
    }, {
      fields: {
        fullname: 1,
        email: 1,
        zipcode: 1
      }
    });
  },
});

Template.contactUsMessageList.helpers({
  contactUsMessages: function() {
    // relies on the published messages filtering by author = this userId
    return ContactUsMessages.find({}, {sort: {createdAt: -1}});
  },
  // someDate: function() {
    // works okay, but now using formatTime() helper defined in profile.js
    // return moment(Template.currentData().createdAt).format('YYYY-MMM-DD HH:mm:ss');
  // },
});

/*
Template.contactUs.onRendered(function () {
  // This way of setting form defaults is not reactive, so form defaults clear out when page is refreshed
  if (Meteor.user()) {
    // Set on-screen email address to same as logged-in user
    $('#email').val(Meteor.user().emails[0].address);
    if (!!Meteor.user().profile & !!Meteor.user().profile.firstname) {
      $('#name').val(Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname);
    }
  } else {
    $('#name').val("");
    $('#email').val("");
  };
});
*/

Template.contactUs.events({
  'submit #contact-us-form': function (event) {
    event.preventDefault();
    // console.log("submit contact-us-form, event: ", event);

    $('#button-submit').text("Submitting message...");
    $('#button-submit').prop( "disabled", "disabled" );

    // TODO alter visible styling on disabled button
    
    var message = {
      name: event.target.name.value,
      email: event.target.email.value,
      zipcode: event.target.zipcode.value,
      text: event.target.message.value,
      mailinglist: event.target.mailinglist.checked,
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
