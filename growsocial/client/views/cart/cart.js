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
  },

  items: function() {
    return ShoppingCart.find({});
  },

  test: [{v: 1, p: [{c: 11}]}, {v: 2, p: [{c: 22}]}, {v: 3, p: [{c: 33}]}, {v: 4, p: [{c: 44}]}]

});

Template.cart.events({
  'click .addSample': function(event) {
    event.preventDefault();

    Meteor.call('addCartItem');
  },

  // Pay to specific vendor
  'click .payVendor': function(event) {
    var email = {
      to: "email@example.com",
      from: "email@growsocial.com",
      subject: "This item has been p1aid",
      text: "The item has been paid!",
    }
    Meteor.call('sendEmail', email);
  },

});
