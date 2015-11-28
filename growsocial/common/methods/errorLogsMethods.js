Meteor.methods({
	// check: function(object, type){
	// 	switch(type){
	// 		case "number":
	// 		break;
	// 		case "string":
	// 		break;

	// 	}
	// },

	addErrorLog: function(error) {

	  	var err = {
	  		userId: Meteor.userId(), // null if not logged in
	  		dateTime: new Date()
	  	};

	  	// Tag (Type of error) (Max 30 characters)
  		if (error.tag.length > 30) {
  			err.tag = error.tag.substring(0, 31);
  		}
  		else {
  			err.tag = error.tag;
  		}
	  	

	  	// Message (Max 200 characters)
  		if (error.message.length > 200) {
  			err.message = error.message.substring(0, 201);
  		}
  		else {
  			err.message = error.message;
  		}
	  	

	  	// Error Number
	  	err.errNumber = error.errNumber;
	  	

	  	// First Name (Max 25 characters)
  		if (error.firstName.length > 25) {
  			err.firstName = error.firstName.substring(0, 26);
  		}
  		else {
  			err.firstName = error.firstName;
  		}
	  	

	  	// Last Name (Max 25 characters)
  		if (error.lastName.length > 25) {
  			err.lastName = error.lastName.substring(0, 26);
  		}
  		else {
  			err.lastName = error.lastName;
  		}
	  	

	  	// Email (Max 254 characters)
  		if (error.email.length > 254) {
  			err.email = error.email.substring(0, 255);
  		}
  		else {
  			err.email = error.email;
  		}
	  	
	  	// Check types
	  	check(err, {
	  		userId: Number,
	  		dateTime: Object,
	  		tag: String,
	  		message: String,
	  		firstName: Match.Optional(String),
	  		lastName: Match.Optional(String),
	  		email: Match.Optional(String)
	  	});

	  	// Store the error
	    ErrorLogs.insert(err);
	  },
});
