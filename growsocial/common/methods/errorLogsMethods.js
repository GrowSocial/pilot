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

	  	// Check types
	  	check(error, {
	  		tag: String,
	  		message: String,
	  		errNumber: Number,
	  		firstName: Match.Optional(String),
	  		lastName: Match.Optional(String),
	  		email: Match.Optional(String)
	  	});

	  	// Tag (Type of error) (Max 30 characters)
	  	if (typeof error.tag !== 'undefined') {
	  		if (error.tag.length > 30) {
	  			err.tag = error.tag.substring(0, 31);
	  		}
	  		else {
	  			err.tag = error.tag;
	  		}
	  	};
  		
	  	// Message (Max 200 characters)
	  	if (typeof error.message !== 'undefined') {
	  		if (error.message.length > 200) {
	  			err.message = error.message.substring(0, 201);
	  		}
	  		else {
	  			err.message = error.message;
	  		}
	  	};

	  	// Error Number
	  	err.errNumber = error.errNumber;
	  	

	  	// First Name (Max 25 characters)
	  	if (typeof error.firstName !== 'undefined') {
	  		if (error.firstName.length > 25) {
	  			err.firstName = error.firstName.substring(0, 26);
	  		}
	  		else {
	  			err.firstName = error.firstName;
	  		}
	  	};

	  	// Last Name (Max 25 characters)
	  	if (typeof error.lastName !== 'undefined') {
	  		if (error.lastName.length > 25) {
	  			err.lastName = error.lastName.substring(0, 26);
	  		}
	  		else {
	  			err.lastName = error.lastName;
	  		}
	  	};

	  	// Email (Max 254 characters)
	  	if (typeof error.email !== 'undefined') {
	  		if (error.email.length > 254) {
	  			err.email = error.email.substring(0, 255);
	  		}
	  		else {
	  			err.email = error.email;
	  		}
  		};
	  	console.log(err.dateTime);
	  	
	  	

	  	// Store the error
	    ErrorLogs.insert(err);
	  },
});
