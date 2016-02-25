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
    var payBtn = event.target;
    var order = this.order;

    // Change button's appearance
    $(payBtn).css("background-color", "#F0AD4E");
    $(payBtn).text("Processing...");
    
    // Call function to pay vendor
    Meteor.call('payVendor', this.order, event.target, function(err, result) {
      // Done message displayed and button removed if no errors are found
      if (!err) {
        payMessage('alert-success', 'Done! You have paid for these items.', payBtn);
        $(payBtn).remove();
        // Archive order
        ArchivedOrders.insert({
          userId: Accounts.userId(),
          vendorName: order.vendorName,
          products: order.products,
        });
        for (var i = 0, len = order.products.length; i < len; i++) {
          Meteor.call('removeFromCart', order.products[i]);
        }
      }
      // If there's an error display pay button again and error message
      else {
        payMessage('alert-danger', 'Oops! Something went wrong while processing the payment, please try again', payBtn);
        $(payBtn).css("background-color", "#64AAD1");
        $(payBtn).text("Pay this vendor");
      }
    });
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

function payMessage(alertType, message, payBtn) {
  // Message structure
  var div = '<div class="row"><div class="alert ' + alertType + 
    ' alert-dismissible" role="alert">' + message + '</div></div>';
  
  // Insert the messagee and remove button
  $(payBtn).before(div);
}
