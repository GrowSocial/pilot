Template.businesses.helpers({
  // TODO pull list of businesses from database
  businessList: [{
      businessId: 1,
      pic: "/images/user-images/business-abc.jpg?v=2",
      name: "ABC Farm Hands United",
    }, 
    {
      businessId: 2,
      pic: "/images/user-images/business-xyz.jpg",
      name: "XYZ Compost Removal",
    },
  ],
  pathForBusiness: function() {
    var person = this;
    var params = {
      businessId: person.businessId
    };
    var path = FlowRouter.path("business", params);
    return path;
  }
});
