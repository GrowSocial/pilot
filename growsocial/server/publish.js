Meteor.publish("contactUsMessages", function () {
  return ContactUsMessages.find({
    authorId: this.userId
  });
});
