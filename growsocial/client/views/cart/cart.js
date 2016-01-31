Template.cart.onRendered(function() {
    $('[data-toggle="popover"]').popover(); 
});

Template.cart.onDestroyed(function() {
    $('[data-toggle="popover"]').popover("hide"); 
});

Template.cart.helpers({
  items: function() {
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
  roundToCents: function(value) {
    return Math.round(value * 100) /100;
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
    var itemsPaid = "";
    for (var i = 0, len = this.products.length; i < len; i++) {
      itemsPaid += "- " + this.products[i].name + " (" + this.products[i].quantity + " " + this.products[i].unitType + ")\n";
    }
    var email = {
      to: this.vendorEmail,  // "seller@example.com",
      from: "email@growsocial.org",
      subject: "You have received a payment",
      text: "The following items have been paid:\n" + itemsPaid,
    }

    if (Meteor.user()) {
      email.text = "Buyer: " + Meteor.user().profile.firstname + " " +
        Meteor.user().profile.lastname + 
        ".\n" + email.text;
    }
    
    Meteor.call('sendEmail', email);

    // prepare notification object
    var notification = {
      targetUserId: '' + this.vendorUserId, // ensure a string
      tag: "Order",
      imageUrl: "/images/icons/dollar.png",
      subject: "Order placed for my market items",
      message: "The following items have been paid:\n" + itemsPaid,
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
    if (this.vendorUserId) { // no point sending a notification to a null person
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
      notification.message = "Seller: " + this.vendorName + ".\nThe following items have been paid:\n" + itemsPaid;
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
    // Create the item
    var item = {
      quantity: this.quantity,
      productId: this.productId,
      name: this.name,
      description: this.description,
      photo: this.photo,
      unitType: this.unitType,
      unitPrice: this.unitPrice,
      currency: this.currency,
    };

    Meteor.call('increaseOrDecrease', true, item);
  },

  'click .decrease': function(event) {
    // Create the item
    var item = {
      quantity: this.quantity,
      productId: this.productId,
      name: this.name,
      description: this.description,
      photo: this.photo,
      unitType: this.unitType,
      unitPrice: this.unitPrice,
      currency: this.currency,
    };

    Meteor.call('increaseOrDecrease', false, item);
  },

  'click .removeItem': function(event) {
    var item = {
      quantity: this.quantity,
      productId: this.productId,
      name: this.name,
      description: this.description,
      photo: this.photo,
      unitType: this.unitType,
      unitPrice: this.unitPrice,
      currency: this.currency,
    }
    
    Meteor.call('removeFromCart', item);
  },

});
