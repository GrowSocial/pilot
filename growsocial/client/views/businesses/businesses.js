Template.businesses.helpers({
  // TODO pull list of businesses from database
  businessList: [{
      businessId: 1,
      pic: "kitten.jpg",
      name: "ABC Farm Hands United",
    }, 
    {
      businessId: 2,
      pic: "grapes.jpg",
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
