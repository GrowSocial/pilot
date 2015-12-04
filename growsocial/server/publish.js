// TODO stop publishing to client on situations like logout

// Contact Us
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

// Shopping Cart
Meteor.publish("shoppingCart", function() {
  return ShoppingCart.find({}, {
    fields: {
      vendorName: 1,
      vendorUserId: 1,
      vendorBusinessId: 1,
      products: 1,
      // quantity: 1,
      // description: 1,
      // unitType: 1,
      // unitPrice: 1,
      // currency: 1,
      // itemTotalPrice: 1,
      // // vendorUserId: 1,
      // // vendorBusinessId: 1,
      // vendorName: 1,
    }
  });
});
