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
    var itemsPaid = "";
    for (var i = 0, len = this.products.length; i < len; i++) {
      itemsPaid += "- " + this.products[i].name + " (" + this.products[i].quantity + " " + this.products[i].unitType + ")\n";
    }
    var email = {
      to: this.vendorEmail,  // "seller@example.com",
      from: "email@growsocial.org",
      subject: "You have received a payment",
      text: "Buyer: " + Meteor.user().profile.firstname + " " +
        Meteor.user().profile.lastname + 
        ".\nThe following items have been paid:\n" + itemsPaid,
    }
    
    Meteor.call('sendEmail', email);

    Meteor.call("addNotification", {
      targetUserId: this.vendorUserId,
      fromUserId: Meteor.userId(),
      fromUserFirstName: Meteor.user().profile.firstname,
      fromUserLastName: Meteor.user().profile.lastname,
      tag: "Order",
      imageUrl: "/images/icons/dollar.png",
      header: "Order placed for my market items",
      message: "The following items have been paid:\n" + itemsPaid,
    }, function(err, result) {
      if (err) {
        Meteor.call("addErrorLog", {
          tag: "PayVendorOrderNotification",
          message: err.message,
          errNumber: err.error,
          email: Meteor.user().emails[0].address,
          firstName: Meteor.user().profile.firstname,
          lastName: Meteor.user().profile.firstname,
        });
      }
    });
    
    Meteor.call("addNotification", {
      targetUserId: Meteor.userId(),
      fromUserFirstName: "System",
      tag: "Order",
      imageUrl: "/images/icons/dollar.png",
      header: "My order placed for market items",
      message: "Seller: " + this.vendorName + ".\nThe following items have been paid:\n" + itemsPaid,
    }, function(err, result) {
      if (err) {
        Meteor.call("addErrorLog", {
          tag: "MyOrderNotification",
          message: err.message,
          errNumber: err.error,
          email: Meteor.user().emails[0].address,
          firstName: Meteor.user().profile.firstname,
          lastName: Meteor.user().profile.firstname,
        });
      }
    });
    
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

Template.marketplace.events({
  'submit .addToCartForm': function(event, template) {
    // Prevent browser from restarting
    event.preventDefault();

    //console.log('this.name = ', this.name); // aunt ruby tomato
    //console.log('this.productId = ', this.productId); // 1
    //console.log('this.vendorEmail = ', this.vendorEmail); // undefined
    //console.log('event.target.quantityNum.value = ', event.target.quantityNum.value); // 17
    //console.log("event.target.vendorEmail = ", event.target.vendorEmail); // yay
    //console.log("event.target.vendorEmail.value = ", event.target.vendorEmail.value); // yay
    
    // console.log('this = ', this); // the values of the item in the each loop, but not its parent

    // TODO add session id or userId
    var item = {
      quantity: parseInt(event.target.quantityNum.value),
      productId: this.productId,
      name: this.name,
      description: this.description,
      photo: this.photo,
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
