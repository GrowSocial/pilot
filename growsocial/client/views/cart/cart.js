Template.cart.helpers({
  items: function() {
    return ShoppingCart.find({});
  },

  totalPrice: function() {
    var total = 0;
    var valueList = ShoppingCart.find({ }, { fields: { vendorTotal: 1 }}).fetch();
    for (var i = 0, len = valueList.length; i < len; i++) {
      total += valueList[i].vendorTotal;
    }
    return total;
  },

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
      subject: "Item paid",
      text: "The item has been paid!",
    }

    Meteor.call('sendEmail', email, function(error, result) {

    });
  },

  'click .removeItem': function(event) {
    var item = {
      quantity: this.quantity,
      productId: this.productId,
      name: this.name,
      description: this.description,
      pic: this.pic,
      unitType: this.unitType,
      unitPrice: this.unitPrice,
      currency: this.currency,
    }
    
    Meteor.call('removeFromCart', item);
  },

});

Template.marketplace.events({
  'submit .addToCartForm': function(event, template) {
    // Prevent browser from restarting
    event.preventDefault();

    console.log('this.name = ', this.name); // aunt ruby tomato
    console.log('this.productId = ', this.productId); // 1
    console.log('this.vendorEmail = ', this.vendorEmail); // undefined
    console.log('event.target.quantityNum.value = ', event.target.quantityNum.value); // 17
    console.log("event.target.vendorEmail = ", event.target.vendorEmail); // yay
    console.log("event.target.vendorEmail.value = ", event.target.vendorEmail.value); // yay
    
    // console.log('this = ', this); // the values of the item in the each loop, but not its parent

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
      vendor_key: event.target.vendor_key.value,
      vendorUserId: event.target.vendorUserId.value,
      vendorBusinessId: event.target.vendorBusinessId.value,
      vendorName: event.target.vendorName.value,
      vendorLink: event.target.vendorLink.value,
      vendorEmail: event.target.vendorEmail.value,
    }
    
    Meteor.call('addCartItem', item);
  },

});
