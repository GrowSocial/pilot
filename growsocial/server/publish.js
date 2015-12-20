// TODO stop publishing to client on situations like logout
Meteor.publish("contactUsMessages", function () {
  if (this.userId) {
    return ContactUsMessages.find({
      authorId: this.userId
    }, {
      fields: {
        name: 1, 
        email: 1, 
        zip: 1, 
        text: 1,
        createdAt: 1,
        authorId: 1,
        }
    });
  } else {
    return [];
  }
});

//Kadira approach to bringing colection data to a template
Meteor.publish('oneProfileRec', function(id) { check(id, String);
  Meteor._sleepForMs(1000);// Make a delay manually to show the loading state
  console.log("server Meteor.publish( found",  People.find({member_key: id}).count());
  return People.find({member_key: id});
});
Meteor.publish(null, function () {
  return [
    MarketItems.find(),    
    Member_Videos.find(),
    Member_Pictures.find(),
    Member_Reviews.find(),
    People.find()    
  ];
});
