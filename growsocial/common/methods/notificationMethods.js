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
      subject: "Meet me in Saint Louis",
      message: "Behind the pub at seventh street.",
    }, {
      tag: "Stock",
      subject: "Beefsteak tomato is sold out",
      message: "Sold out today, I'm growing more, ready by next week.",
    }, {
      tag: "Reminder",
      subject: "Community garden volunteer day tomorrow",
      message: "Behind the pub at seventh street.",
    }]);
    
    if (fromUser.firstname === "System") {
      msg = {
        tag: "System",
        subject: "Web site upgrade scheduled for Thursday",
        message: "New version incoming, <a href='/help'>click here for help</a>.",
      }
    }
    
    var notification = {
      targetUserId: Meteor.userId(),
      sender: fromUser.firstname,
      tag: msg.tag,
      subject: msg.subject,
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
      senderUserId: Match.Optional(String),
      sender: Match.Optional(String),
      senderLastName: Match.Optional(String),
      tag: String, // category / type
      subject: String,
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
  },

	deleteNotification: function(noteId) {
    Notifications.remove({_id: noteId, targetUserId: Accounts.userId()});
  },
});
