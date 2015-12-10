Template.cart.helpers({
  items: function() {
    return ShoppingCart.find({});
  },

});

Template.cart.events({
  // remove this
  // ***********************************
  'click .addSample': function(event) {
    event.preventDefault();

    Meteor.call('addCartItem');
  },
  // ***********************************
  // remove this

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

Template.marketplace.events({
  'submit .addToCartForm': function(event) {
    // Prevent browser from restarting
    event.preventDefault();


    console.log(event.target.quantityNum.value);
  },

});
