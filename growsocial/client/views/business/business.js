Template.business.helpers({
  business: function() {
    // TODO why is this function run 4 times?
    var businessId = FlowRouter.getParam("businessId");
    console.log("This is my business: ", businessId);
    // TODO retrieve person details from database
    if (businessId == 1) {
      return {
        businessId: businessId,
        name: "ABC Farm Hands United",
        pic: "/images/user-images/business-abc.jpg?v=2",
        };
    } else {
      return {
        businessId: businessId,
        name: "XYZ Compost Removal",
        pic: "/images/user-images/business-xyz.jpg",
        };
    };
  },
});
