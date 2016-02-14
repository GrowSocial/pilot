Template.marketplace.helpers({
  vendorList: function () { 
    // all vendors
    return MarketItems.find();
  },
});

Template.store.helpers({
  vendorList: function () { 
    // particular vendor, default to "my store"
    var vendor_key = FlowRouter.getQueryParam("v");
    if (!vendor_key) {
      vendor_key = Meteor.userId();
    }
    if (vendor_key) {
      return MarketItems.find({'vendor_key': vendor_key});
    } else {
      return [];
    }
  },
});

var scrollToSelected = function() {
  var sel = $('#selectedRow')[0];
  if (sel) sel.scrollIntoView(false);
}

Template.productShelf.onRendered(function() {
  const instance = this;
  
  // when selection changes, lag a little then jump to the selection
  instance.autorun(function() {
    if(FlowRouter.getQueryParam("p")) {
      Meteor.setTimeout(scrollToSelected, 300);
    }
  });
});

Template.productShelf.helpers({
  selectedVP: function() {
    return {
      vendorId: FlowRouter.getQueryParam("v"),
      productId: FlowRouter.getQueryParam("p"),
    };
  },

  isSelected: function(item) {
    if (item.productId === FlowRouter.getQueryParam("p")) {
      return true;
    }
  },
});

// shared helper functions in marketplace

var helperMarketGetItemImage = function(item) {
  // TODO get larger image if selected item
  if (item && item.photo && item.photo.src) {
    return item.photo.src;
  } else {
    return "/images/user-images/AuntRubyTomato128.png";
  }
}

var helperMarketGetVendorLink = function(vendor) {
  // TODO vendorLink is currently tainted by user entry!
  // if (vendor && vendor.vendorLink) {
    // return vendor.vendorLink;
  // }
  if (vendor && vendor.vendorUserId) {
    return "/profile/" + vendor.vendorUserId;
  }
  return "";
}

var helperMarketDisclaimer = function() {
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
}

Template.productSummary.helpers({
  getItemImage: helperMarketGetItemImage,

  getVendorLink: helperMarketGetVendorLink,

  disclaimer: helperMarketDisclaimer,
});

Template.productDetail.helpers({
  getItemImage: helperMarketGetItemImage,
  
  getVendorLink: helperMarketGetVendorLink,
  
  disclaimer: helperMarketDisclaimer,
  
  isMyProduct: function(vendor) {
    if (vendor.vendor_key === Meteor.userId()) {
      return true;
    }
  }
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
});

Template.productSummary.events({
  'click .moreButton': function(event, template) {
    // Prevent browser from restarting
    event.preventDefault();
    if (FlowRouter.getQueryParam('p') === this.item.productId) {
      // already selected, scroll to selection
      scrollToSelected();
    } else {
      // set queryParam to select this product, and scroll to it
      FlowRouter.setQueryParams({'v': this.vendor.vendorUserId, 'p': this.item.productId});
    }
  },
});

Template.productDetail.events({
  'click .closeDetail': function(event, template) {
    // Prevent browser from restarting
      // remove this productId from queryParam
    FlowRouter.setQueryParams({'p': null});
  },
  
  'submit .addToCartForm': function(event, template) {
    // Prevent browser from restarting
    event.preventDefault();
    
    var alertDiv = event.target.getElementsByClassName('buyAlert')[0];
    var alertTextNode = alertDiv.childNodes[0];
    alertDiv.classList.remove('alert-info');
    alertDiv.classList.remove('alert-danger');
    alertDiv.classList.remove('alert-success');
    alertTextNode.data = " ";
    
    // TODO validate quantity, not negative or zero or blank
    var parsedQty = parseInt(event.target.quantityNum.value);
    if (!parsedQty) {
      alertDiv.classList.add('alert-danger');
      alertTextNode.data = "Error in quantity.";
      return;
    }

    alertDiv.classList.add('alert-info');
    alertTextNode.data = "Updating cart ...";
    
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
      if (error) {
        alertDiv.classList.remove('alert-info');
        alertDiv.classList.add('alert-danger');
        alertTextNode.data = 'Error';
        marketNotify('alert-danger', error.message);
      } else {
        // marketNotify('alert-success', 'Updated shopping cart.');
        alertDiv.classList.remove('alert-info');
        alertDiv.classList.add('alert-success');
        alertTextNode.data = 'Updated cart.';
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
