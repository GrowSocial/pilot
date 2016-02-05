UI.registerHelper('roundToCents', function(value) {
  if(value) return Math.round(value * 100) /100;
});

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
    var order = this.order;
    var itemsPaid = "";
    for (var i = 0, len = order.products.length; i < len; i++) {
      itemsPaid += "- " + order.products[i].name + " (" + order.products[i].quantity + " " + order.products[i].unitType + ")\n";
    }
    console.log('itemsPaid',itemsPaid);
    var email = {
      to: order.vendorEmail,  // "seller@example.com",
      from: "GrowSocial Pilot Website <growsocial.org@gmail.com>",
      subject: "You have received a payment",
      text: "The following items have been paid:\n" + itemsPaid,
    }

    if (Meteor.user()) {
      email.text = "Buyer: " + Meteor.user().profile.firstname + " " +
        Meteor.user().profile.lastname + 
        ".\n" + email.text;
    }
    
    Meteor.call('sendEmail', email);

    if (Meteor.user()) {
      email.to = Meteor.user().emails[0].address;  // "buyer@example.com",
      email.subject = "You have made a payment";
      email.text = "Seller: " + order.vendorName + "\nYou paid for the following: " + itemsPaid;
    }
    
    Meteor.call('sendEmail', email);
    
    // prepare notification object
    var notification = {
      targetUserId: '' + order.vendorUserId, // ensure a string
      tag: "Order",
      html: true,
      imageUrl: "/images/icons/dollar.png",
      subject: "Order placed for my market items",
      message: "Buyer: " + Meteor.user().profile.firstname + " " +
        Meteor.user().profile.lastname + ". The following items have been paid:\n" + itemsPaid,
    };
    var error = {};
    
    // account for when buyer is not logged in
    if (Meteor.user()) {
      notification.senderUserId = Meteor.userId();
      notification.sender = Meteor.user().profile.firstname;
      notification.senderLastName = Meteor.user().profile.lastname;
      error.email = Meteor.user().emails[0].address;
      error.firstName = Meteor.user().profile.firstname;
      error.lastName = Meteor.user().profile.lastname;
    } else {
      notification.sender = 'Anonymous';
      error.firstName = 'Anonymous';
    }
    
    // console.log('first notification', notification);
    // first notification to the seller
    if (order.vendorUserId) { // no point sending a notification to a null person
      Meteor.call("addNotification", notification, function(err, result) {
        if (err) {
          error.tag = "PayVendorOrderNotification";
          error.message = err.message;
          error.errNumber = err.error;
          Meteor.call("addErrorLog", error);
        }
      });
    }

    // prepare second notification    
    if (Meteor.user()) {  // only notify if logged in!
      notification.targetUserId = Meteor.userId();
      notification.senderUserId = Meteor.userId();
      notification.sender = Meteor.user().profile.firstname;
      notification.senderLastName = Meteor.user().profile.lastname;

      // second notification to the buyer    
      notification.subject = "My order placed for market items";
      notification.sender = "System";
      notification.message = "Seller: " + order.vendorName + ".\nThe following items have been paid:\n" + itemsPaid;
      // console.log('second notification', notification);
      Meteor.call("addNotification", notification, function(err, result) {
        if (err) {
          error.tag = "MyOrderNotification";
          error.message = err.message;
          error.errNumber = err.error;
          Meteor.call("addErrorLog", error);
        }
      });
    }
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
