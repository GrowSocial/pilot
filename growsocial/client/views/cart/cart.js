Template.cart.onRendered(function() {
    $('[data-toggle="popover"]').popover(); 
});

Template.cart.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});

Template.cart.helpers({
  orders: function() {
    return ShoppingCart.find({userId: Meteor.userId()});
  },

  totalPrice: function() {
    var total = 0;
    var valueList = ShoppingCart.find({ userId: Meteor.userId() }, { fields: { vendorTotal: 1 }}).fetch();
    for (var i = 0, len = valueList.length; i < len; i++) {
      total += valueList[i].vendorTotal;
    }
    return Math.round(total * 100) /100;
  },
});

Template.cart.events({
  'click .addSample': function(event) {
    event.preventDefault();

    Meteor.call('addCartSampleItems');
  },

  // Pay to specific vendor
  'click .payVendor': function(event) {
    // event.preventDefault();  // oops we need the click at the moment for the popover!
    Meteor.call('payVendor',this.order);
    // TODO better response to user on error/correct payment
  },

  'click .increase': function(event) {
    var item = {
      quantity: this.product.quantity,
      productId: this.product.productId,
      name: this.product.name,
      description: this.product.description,
      photo: this.product.photo,
      unitType: this.product.unitType,
      unitPrice: this.product.unitPrice,
      currency: this.product.currency,
    };

    Meteor.call('increaseOrDecrease', true, item);
  },

  'click .decrease': function(event) {
    var item = {
      quantity: this.product.quantity,
      productId: this.product.productId,
      name: this.product.name,
      description: this.product.description,
      photo: this.product.photo,
      unitType: this.product.unitType,
      unitPrice: this.product.unitPrice,
      currency: this.product.currency,
    };

    Meteor.call('increaseOrDecrease', false, item);
  },

  'click .removeItem': function(event) {
    var item = {
      quantity: this.product.quantity,
      productId: this.product.productId,
      name: this.product.name,
      description: this.product.description,
      photo: this.product.photo,
      unitType: this.product.unitType,
      unitPrice: this.product.unitPrice,
      currency: this.product.currency,
    }
    
    Meteor.call('removeFromCart', item);
  },

});
