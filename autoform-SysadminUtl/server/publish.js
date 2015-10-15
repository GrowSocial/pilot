Meteor.publish(null, function () {
  return [
    People.find(),
    Bizness.find()
  ];
});

