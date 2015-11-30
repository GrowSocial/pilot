// TODO on successful login, navigate to page previous to login page in history (if internal)
// TODO report errors to server to help support analysis - spam prevention will need to limit storage by IP address
// TODO email server (mailchimp?)
// TODO facebook registration, retrieve facebook details
// TODO edit name, add/remove email, add/remove username, verify email
// TODO share the same helper code for info/error messages
// TODO on submit, disable form while submission being handled

// Log In
Template.login.onCreated(function () {
  this.messages = new ReactiveDict(); 
});

Template.login.helpers({
  infoMessage: function () {
    return Template.instance().messages.get('infoMessage');
  },
  errorMessage: function () {
    return Template.instance().messages.get('errorMessage');
  },
});

Template.login.events({
  'submit .login-form': function (event, template) {
    event.preventDefault();
    
    // template === Template.instance()
    
    template.messages.set('errorMessage', null);
    template.messages.set('infoMessage', "Logging in ...");
    
    var email = event.target.email.value;
    var password = event.target.password.value;
    
    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        console.log('loginWithPassword error message:', err.message);
        template.messages.set('infoMessage', null);
        template.messages.set('errorMessage', err.message);

        // Send error to database
        var error = {
          tag: "LoginWithPassword",
          message: err.message,
          errNumber: err.error,
          email: email
        }
        Meteor.call("addErrorLog", error);
      } else {
        template.messages.set('infoMessage', null);
        // TODO go back to whatever page was on before pressing Login
        FlowRouter.go("home");
      }
    });
  },
  
  'click .btn-facebook':function(event, template) {
    event.preventDefault();
    var options = {
      requestPermissions: ['public_profile', 'email'],
      loginStyle: 'popup',
    };
    Meteor.loginWithFacebook(options, function(err) {
      if (err) {
        console.log('loginWithFacebook error message:', err.message);
        template.messages.set('infoMessage', null);
        template.messages.set('errorMessage', err.message);

        // Send error to database
        var error = {
          tag: "loginWithFacebook",
          message: err.message,
          errNumber: err.error,
          email: email
        }
        Meteor.call("addErrorLog", error);
      } else {
        template.messages.set('infoMessage', null);
        // TODO go back to whatever page was on before pressing Login
        FlowRouter.go("home");
      }
    });
  }
});

// Register
Template.register.onCreated(function () {
  this.messages = new ReactiveDict(); 
});

Template.register.helpers({
  infoMessage: function () {
    return Template.instance().messages.get('infoMessage');
  },
  errorMessage: function () {
    return Template.instance().messages.get('errorMessage');
  },
});

Template.register.events({
  'submit .register-form': function (event, template) {
    event.preventDefault();

    template.messages.set('errorMessage', null);
    template.messages.set('infoMessage', "Registering new account ...");

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
        console.log('createUser error message:', err.message);
        template.messages.set('infoMessage', null);
        template.messages.set('errorMessage', err.message);

        // TODO log the error in the database, unless it's "unable to connect" error
        
        // Send error to database
        var error = {
          tag: "Register",
          message: err.message,
          errNumber: err.error,
          email: user.email,
          firstName: user.profile.firstname,
          lastName: user.profile.lastname
        }
        Meteor.call("addErrorLog", error);
        // what happens if database/internet disconnected? the app blocks! when connection restored, attempt is resumed.
      } else {
        template.messages.set('infoMessage', 'Registered and logged in.');
        // FlowRouter.go("home");
      }
    });
  }
});

// Forgot Password
Template.forgotPassword.onCreated(function () {
  this.messages = new ReactiveDict(); 
});

Template.forgotPassword.helpers({
  infoMessage: function () {
    return Template.instance().messages.get('infoMessage');
  },
  errorMessage: function () {
    return Template.instance().messages.get('errorMessage');
  },
});

Template.forgotPassword.events({
  'submit .forgot-form': function (event, template) {
    event.preventDefault();
    
    template.messages.set('errorMessage', null);
    template.messages.set('infoMessage', "Resetting password ...");
    
    var email = event.target.email.value;
    
    // As at 2015-11-16 forgotPassword throws an exception if email empty, so either handle it or prevent it
    // bug raised: https://github.com/meteor/meteor/issues/5664
    if (email) {
      Accounts.forgotPassword({
        email: email,
      }, function(err) {
        if (err) {
          console.log('forgotPassword error message:', err.message);
          template.messages.set('infoMessage', null);
          template.messages.set('errorMessage', err.message);

          // Send error to database
          var error = {
            tag: "ForgotPassword",
            message: err.message,
            errNumber: err.error,
            email: email
          }
          Meteor.call("addErrorLog", error);
        } else {
          template.messages.set('infoMessage', 'Email sent: how to reset your password.');
          // FlowRouter.go("home");
        }
      });
    } else {
      template.messages.set('infoMessage', null);
      template.messages.set('errorMessage', 'Email address needs to be entered.');
    }
  },
});

// Change Password
Template.changePassword.onCreated(function() {
  var self = this;

  this.messages = new ReactiveDict(); 

  // this will rerun if meteor user changes
  this.autorun(function() {
    // No point showing changePassword when not logged in
    if (!Meteor.user()) {
        FlowRouter.go("home");
    };
  });
});

Template.changePassword.helpers({
  infoMessage: function () {
    return Template.instance().messages.get('infoMessage');
  },
  errorMessage: function () {
    return Template.instance().messages.get('errorMessage');
  },
});

Template.changePassword.events({
  'submit .change-password-form': function (event, template) {
    event.preventDefault();

    template.messages.set('errorMessage', null);
    template.messages.set('infoMessage', "Changing password ...");
    
    var oldPassword = event.target.currentPassword.value;
    var newPassword = event.target.newPassword.value;
    
    Accounts.changePassword(oldPassword, newPassword, function(err) {
      if (err) {
        console.log('changePassword error message:', err.message);
        template.messages.set('infoMessage', null);
        template.messages.set('errorMessage', err.message);

        // Send error to database
        var error = {
          tag: "ChangePassword",
          message: err.message,
          errNumber: err.error
        }
        Meteor.call("addErrorLog", error);
      } else {
        template.messages.set('infoMessage', 'Password changed.');
        // FlowRouter.go("home");
      }
    });
  },
});
