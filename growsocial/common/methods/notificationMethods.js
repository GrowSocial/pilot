Meteor.methods({
  
  addSampleNotification: function() {

    // Random.choice() and .id() choose differently on client/server!
    // TODO client side here just add a stub for the data
    
    var fromUser;
    var msg;
    if (this.isSimulation) {
      fromUser = {
        firstname: " ",
        // imageUrl: "/images/user-images/profile-mary.jpg", // TODO placeholder image
      };
      msg = {
        tag: " ",
        subject: " ",
        message: " ",
      };
    } else {
      fromUser = Random.choice([{
        firstname: "Mary",
        imageUrl: "/images/user-images/profile-mary.jpg",
      }, {
        firstname: "Anthony",
        imageUrl: "/images/user-images/profile-anthony.jpg",
      }]);
      
     var d = function (n) { return Math.floor(Random.fraction() * n) + 1; };
     
      msg = Random.choice([{
        tag: "Message",
        subject: "(sample) Meet me in Saint Louis",
        message: "Behind the pub at seventh street.",
      }, {
        tag: "Stock",
        subject: "(sample) Beefsteak tomato is sold out",
        message: "Sold out today, I'm growing more, ready by next week.",
      }, {
        tag: "Reminder",
        subject: "(sample) Community garden volunteer day tomorrow",
        message: "Behind the pub at seventh street.",
      }, {
        tag: "Reminder",
        subject: "(sample) Party at Cynthia's house 7pm tonight",
        message: "Bring a plate of healthy food and a happy demeanor.",
      }, {
        tag: "Lottery",
        subject: "(sample) Winning lottery numbers",
        message: "The winning lottery numbers for tonight's powerball draw will be: " + 
          d(69) + ' ' + d(69) + ' ' + d(69) + ' ' + d(69) + ' ' + d(69) + ' ' + d(29),
      }]);
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
