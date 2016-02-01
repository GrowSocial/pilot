Template.marketplace.helpers({
  // "selectedProduct" is the currently selected product, could be none selected.
  
  // TODO There will also be a list of other available products,
  // depending on whether showing general marketplace, or storefront for
  // a particular business or a particular person.
  
  // pull vendor/product list from the database
  vendorList: function () { 
    return MarketItems.find();
  },
/*
  selectedProduct: function() {
    var productId = FlowRouter.getParam("productId");
    console.log("This is my selected product: ", productId);
    if (productId && productId !== '0') {
      return productId;
    } else {
      return [];
    }
  },
*/
});

Template.marketplaceItem.helpers({
  disclaimer: function() {
    return Random.choice([
      "This product may be in imagination only.",
      "Please read fine print carefully.",
      "Product to be taken orally.",
      "Keep away from non-children.",
      "I can't believe it's not apple!",
      "Shaken, not stirred.",
      "Stirred, not shaken.",
      "May your life be interesting.",
      "Gather at Cynthia's house at 7pm for the big party.",
    ]);
  },
  getItemImage: function(item) {
    // TODO get larger image if selected item
    if (item && item.photo && item.photo.src) {
      return item.photo.src;
    } else {
      return "/images/user-images/AuntRubyTomato128.png";
    }
  },
  selectedItem: function(item) {
    // TODO selected item track by router queryParam
    return true;
    // if (item.productId === "LsXh4rjRPssvkmrkv") {
      // return true;
    // } else {
      // return false;
    // }
  },
  getVendorLink: function(vendor) {
    if (vendor && vendor.vendorLink) {
      return vendor.vendorLink;
    }
    if (vendor && vendor.vendorUserId) {
      return "/profile/" + vendor.vendorUserId;
    }
    return "";
  },
});

Template.marketplace.onDestroyed(function() {
  $('.popoverThis').popover('hide');
});

Template.marketplace.onRendered(function() {
  // $('.popoverThis').popover({
      // html: true,
      // title: 'Add to Cart <a class="close">&times;</a>',
      // content: $('.popoverContent').html(),
  // });
  $('.popoverThis').popover();
  
  // $('.popoverThis').click(function (e) {
      // e.stopPropagation();
  // });
  
  // $(document).click(function (e) {
      // if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
          // $('.popoverThis').popover('hide');
      // }
  // });
});

Template.marketplace.events({
  'click #addSampleProductsButton': function(event, template) {
    event.preventDefault();
    var addedList = Meteor.call('addMarketSampleProducts', function (error, result) { 
      // console.log('addedList:', result);
      var index;
      var html='<ul>';
      for (index = 0; index < result.length; ++index) {
          // console.log(result[index]);
          html = html + '<li>' + result[index] + '</li>';
      }
      html = html + '</ul>';
      marketNotify('alert-info', 'Products added.' + html);
    });
  },
  'click #removeSampleProductsButton': function(event) {
    event.preventDefault();
    var addedList = Meteor.call('removeMarketSampleProducts', function (error, result) { 
      if (error) {
        marketNotify('alert-danger', error.message);
      } else {
        marketNotify('alert-info', 'Sample products removed.');
      }
    });
  },
  'submit .addToCartForm': function(event, template) {
    // Prevent browser from restarting
    event.preventDefault();

    // console.log('this = ', this); // the values of the item in the each loop, but not its parent
    // console.log('this.item = ', this.item); // 
    // console.log('this.vendor = ', this.vendor); // 
    // console.log('event.target = ', event.target); // 
    // console.log('event.target.quantityNum = ', event.target.quantityNum); // 17
    // console.log('event.target.quantityNum.value = ', event.target.quantityNum.value); // 17
    
    // TODO validate quantity, not negative or zero or blank
    var parsedQty = parseInt(event.target.quantityNum.value);
    if (!parsedQty) return;
    
    // TODO add session id or userId
    var item = {
      quantity: parsedQty,
      productId: this.item.productId,
      name: this.item.name,
      description: this.item.description,
      photo: this.item.photo,
      unitType: this.item.unitType,
      unitPrice: this.item.unitPrice,
      currency: this.item.currency,
      vendor_key: this.vendor.vendor_key,
      vendorUserId: this.vendor.vendorUserId,
      vendorBusinessId: this.vendor.vendorBusinessId,
      vendorName: this.vendor.vendorName,
      vendorLink: this.vendor.vendorLink,
      vendorEmail: this.vendor.vendorEmail,
    }

    Meteor.call('addCartItem', item, function(error, result) { 
      // $('.popoverThis').popover('hide');
      if (error) {
        marketNotify('alert-danger', error.message);
      } else {
        marketNotify('alert-info', 'Updated shopping cart.');
      }
    });
  },
});

function marketNotify(alertType, message) {
  var div = '<div class="row"><div class="alert ' + 
    alertType + 
    ' alert-dismissible col-md-6 col-sm-6 col-xs-12" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
    message + 
    '</div></div>';
  $('#marketNotifyDiv').after(div);
}
