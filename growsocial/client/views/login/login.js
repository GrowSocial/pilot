// TODO on successful login, navigate to page previous to login page in history (if internal)
// TODO report errors to user in a useful way
// TODO email server (mailchimp?)
// TODO facebook registration, retrieve facebook details
// TODO edit name, add/remove email, add/remove username, verify email

Template.login.events({
  'submit .login-form': function (event) {
    event.preventDefault();
    
    var email = event.target.email.value;
    var password = event.target.password.value;
    
    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        console.log('loginWithPassword error:', err);
        console.log('loginWithPassword error message:', err.message);
      } else {
        FlowRouter.go("home");
      }
    });
  },
  'click .btn-facebook':function(event) {
    event.preventDefault();
    Meteor.loginWithFacebook(function(err) {
      if (err) {
        console.log('loginWithFacebook error:', err);
        console.log('loginWithFacebook error message:', err.message);
      } else {
        FlowRouter.go("home");
      }
    });
  }
});

Template.register.events({
  'submit .register-form': function (event) {
    event.preventDefault();

    var email = event.target.email.value;
    var password = event.target.password.value;
    var firstname = event.target.firstname.value;
    var lastname = event.target.lastname.value;

    var user = {
      'email': email,
      password: password,
      profile: {
        firstname: firstname,
        lastname: lastname,
        name: firstname + " " + lastname,
        },
      };

    Accounts.createUser(user, function(err) {
      if (err) {
        // errorClass {error: 403, reason: "Email already exists.", details: undefined, message: "Email already exists. [403]", errorType: "Meteor.Error"}
        console.log('createUser error:', err);
        console.log('createUser error message:', err.message);
        // TODO log the error in the database, unless it's "unable to connect" error
        // TODO show the error to the user
        // what happens if database/internet disconnected? the app blocks! when connection restored, attempt is resumed.
      } else {
        FlowRouter.go("home");
      }
    });
  }
});

Template.forgotPassword.events({
  'submit .forgot-form': function (event) {
    event.preventDefault();
    
    var email = event.target.email.value;
    
    Accounts.forgotPassword({
      email: email,
    }, function(err) {
      if (err) {
        console.log('forgotPassword error:', err);
        console.log('forgotPassword error message:', err.message);
      } else {
        FlowRouter.go("home");
      }
    });
  },
});

Template.changePassword.events({
  'submit .change-password-form': function (event) {
    event.preventDefault();
    
    var oldPassword = event.target.currentPassword.value;
    var newPassword = event.target.newPassword.value;
    
    Accounts.changePassword(oldPassword, newPassword, function(err) {
      if (err) {
        console.log('forgotPassword error:', err);
        console.log('forgotPassword error message:', err.message);
      } else {
        // TODO show user positive response that has changed
        FlowRouter.go("home");
      }
    });
  },
});

Template.changePassword.onCreated(function() {
  var self = this;

  // this will rerun if meteor user changes
  this.autorun(function() {
    // No point showing changePassword when not logged in
    if (!Meteor.user()) {
        FlowRouter.go("home");
    };
  });
});
