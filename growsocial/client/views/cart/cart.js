Template.cart.helpers({
  items: function() {
    return ShoppingCart.find({});
  },

  // totalPrice: function() {
  //   ShoppingCart.find({})
  //   return;
  // },

});

Template.cart.events({
  // remove this
  // ***********************************
  'click .addSample': function(event) {
    event.preventDefault();

    Meteor.call('addCartSampleItems');
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

    // TODO add session id or userId
    var item = {
      quantity: event.target.quantityNum.value,
      productId: this.productId,
      name: this.name,
      description: this.description,
      pic: this.pic,
      unitType: this.unitType,
      unitPrice: this.unitPrice,
      currency: this.currency,
      vendorUserId: this.vendorUserId,
      vendorBusinessId: this.vendorBusinessId,
      vendorName: this.vendorName,
      vendorLink: this.vendorLink,
      vendorEmail: this.vendorEmail,
    }
    
    Meteor.call('addCartItem', item);
  },

});
