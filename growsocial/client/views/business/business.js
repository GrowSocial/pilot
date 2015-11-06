Template.business.helpers({
  business: function() {
    // TODO why is this function run 4 times?
    var businessId = FlowRouter.getParam("businessId");
    console.log("This is my business: ", businessId);
    // TODO retrieve person details from database, instead is hard-coded here
    // var cursor = Businesses.find({businessId: businessId});
    // return cursor;
    if (businessId == 1) {
      return {
        businessId: businessId,
        name: "ABC Farm Hands United",
        pic: "kitten.jpg",
        };
    } else {
      return {
        businessId: businessId,
        name: "XYZ Compost Removal",
        pic: "grapes.jpg",
        };
    };
  },
});
