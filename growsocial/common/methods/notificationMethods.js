Meteor.methods({
  
  addSampleNotification: function() {

    var fromUser = Random.choice([{
      firstname: "Mary",
      imageUrl: "/images/user-images/profile-mary.jpg",
    }, {
      firstname: "Anthony",
      imageUrl: "/images/user-images/profile-anthony.jpg",
    }, {
      firstname: "System",
      imageUrl: "/images/logo_icon.png",
    }]);
    
    var msg = Random.choice([{
      tag: "Message",
      header: "Meet me in Saint Louis",
      message: "Behind the pub at seventh street.",
    }, {
      tag: "Stock",
      header: "Beefsteak tomato is sold out",
      message: "Sold out today, I'm growing more, ready by next week.",
    }, {
      tag: "Reminder",
      header: "Community garden volunteer day tomorrow",
      message: "Behind the pub at seventh street.",
    }]);
    
    if (fromUser.firstname === "System") {
      msg = {
        tag: "System",
        header: "Web site upgrade scheduled for Thursday",
        message: "New version incoming!!",
      }
    }
    
    var notification = {
      targetUserId: Meteor.userId(),
      fromUserFirstName: fromUser.firstname,
      tag: msg.tag,
      header: msg.header,
      message: msg.message,
      imageUrl: fromUser.imageUrl,
      dateTime: new Date(),
    };
    Notifications.insert(notification);
  },

	addNotification: function(notification) {

    // Check types
    check(notification, {
      targetUserId: String,
      fromUserId: Match.Optional(String),
      fromUserFirstName: Match.Optional(String),
      fromUserLastName: Match.Optional(String),
      tag: String, // category / type
      header: String,
      message: String,
      imageUrl: Match.Optional(String),
      expireDate: Match.Optional(Date),
    });

    if (notification.tag === "System") {
      notification.imageUrl = "/images/logo_icon.png";
    }
    notification.dateTime = new Date();

    // console.log('addNotification: ', notification);

    Notifications.insert(notification);
  },
    
	clearMyNotifications: function() {
    Notifications.remove({targetUserId: Accounts.userId()});
  }
});
