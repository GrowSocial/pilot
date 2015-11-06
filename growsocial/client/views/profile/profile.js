Template.profile.helpers({
  person: function() {
    // TODO why is this function run 4 times?
    var personId = FlowRouter.getParam("personId");
    console.log("This is my profile: ", personId);
    // TODO retrieve person details from database, instead is hard-coded here
    // var cursor = People.find({personId: personId});
    // return cursor;
    if (personId == 1) {
      return {
        personId: personId,
        name: "Jane",
        pic: "beagle.jpg",
        };
    } else {
      return {
        personId: personId,
        name: "Mary",
        pic: "turkey.jpg",
        };
    };
  },
});
