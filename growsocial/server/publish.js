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
