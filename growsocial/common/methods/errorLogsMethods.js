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
	  	if (typeof error.tag === 'string') {
	  		if (error.tag.length > 30) {
	  			err.tag = error.tag.substring(0, 31);
	  		}
	  		else {
	  			err.tag = error.tag;
	  		}
	  	}

	  	// Message (Max 40 characters)
	  	if (typeof error.message === 'string') {
	  		if (error.message.length > 40) {
	  			err.message = error.message.substring(0, 41);
	  		}
	  		else {
	  			err.message = error.message;
	  		}
	  	}

	  	// Error Number
	  	if (typeof error.errNumber === 'number') {
	  		err.errNumber = error.errNumber;
	  	}

	  	// First Name (Max 25 characters)
	  	if (typeof error.fName === 'string') {
	  		if (error.fName.length > 25) {
	  			err.fName = error.fName.substring(0, 26);
	  		}
	  		else {
	  			err.fName = error.fName;
	  		}
	  	}

	  	// Last Name (Max 25 characters)
	  	if (typeof error.lName === 'string') {
	  		if (error.lName.length > 25) {
	  			err.lName = error.lName.substring(0, 26);
	  		}
	  		else {
	  			err.lName = error.lName;
	  		}
	  	}

	  	// Email (Max 254 characters)
	  	if (typeof error.email === 'string') {
	  		if (error.email.length > 254) {
	  			err.email = error.email.substring(0, 255);
	  		}
	  		else {
	  			err.email = error.email;
	  		}
	  	}

	  	// Store the error
	    ErrorLogs.insert(err);
	  },
});
