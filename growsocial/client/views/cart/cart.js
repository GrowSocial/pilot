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

  items: function() {
    return ShoppingCart.find({});
  },

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
      from: "email@growsocial.org",
      subject: "This item has been paid",
      text: "The item has been paid!",
    }
    Meteor.call('sendEmail', email);
  },

});

Template.addQtyToCart.events({
  'click .addToCart': function(event) {
    console.log("a");
    console.log(event);
  },

});
