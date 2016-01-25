Meteor.methods({

	saveLatLng: function(newlatlng) {

    // Check types
    check(newlatlng, {
      lat: Number,
      lng: Number,
    });

    if (Meteor.isServer) {
      if (Accounts.userId()) {
        People.update({member_key: Accounts.userId()}, {$set: {latlng: newlatlng}});
      }
    }
  },
    
	loadLatLng: function() {
    if (Meteor.isServer) {
      if (Accounts.userId()) {
        var personStuff = People.findOne({member_key: Accounts.userId()}, {fields: {latlng: 1}});
        if(personStuff && personStuff.latlng) {
          return personStuff.latlng;
        } else {
          throw new Meteor.Error("latlng-not-found", "Latlng not yet defined");
        }
      }
    }
  },
});
