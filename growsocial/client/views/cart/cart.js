Template.cart.helpers({
  // TODO pull cart items from database
  // cartItems: [{
  //     quantity: 3,
  //     description: "Beefsteak tomato",
  //     unitType: "each",
  //     unitPrice: 2.20,
  //     currency: 'USD',
  //     itemTotalPrice: 6.60,
  //     vendorUserId: 1,
  //     vendorName: 'Anthony',
  //   }, {
  //     quantity: 3,
  //     description: "Big Millet",
  //     unitType: "pounds",
  //     unitPrice: 2.20,
  //     currency: 'USD',
  //     itemTotalPrice: 6.60,
  //     vendorBusinessId: 2,
  //     vendorName: 'Grains R Us',
  //   }, 
  // ],

  cartItems: function() {
    return ShoppingCart.find({});
  }

});

//Remove this
Template.cart.events({
  'click .addSample': function(event) {
    event.preventDefault();

    Meteor.call('addCartItem');
  }

  // 'click .removeSample': function() {
  //   ShoppingCart.remove({});
  // }
});
//Remove this
