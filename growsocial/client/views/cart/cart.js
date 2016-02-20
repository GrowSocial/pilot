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

Template.orderDetail.helpers({
  pathForStore: function(vendorId) {
    var path = FlowRouter.path("store", {}, {'v': vendorId});
    return path;
  },
});

Template.cart.events({
  // Add sample data
  'click .addSample': function(event) {
    event.preventDefault();

    Meteor.call('addCartSampleItems');
  },

  // Pay to specific vendor
  'click .payVendor': function(event) {
    // Change button's appearance
    $(event.target).css("background-color", "#F0AD4E");
    $(event.target).text("Processing...");

    // Call function to pay vendor
    Meteor.call('payVendor', this.order);
    // TODO better response to user on error/correct payment
  },

  // Increase ammount by 1
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

  // Decrease ammount by 1
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

  // Remove item from list
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

Template.archivedOrders.helpers({
  archive: function() {
    return ArchivedOrders.find({userId: Meteor.userId()});
  },
});

