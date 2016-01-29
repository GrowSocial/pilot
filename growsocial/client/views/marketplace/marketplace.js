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
  randomPhotoSrc: function () {
    return Random.choice([
      "/images/user-images/AuntRubyTomato128.png",
      // "/images/user-images/Carrots128.png",
      // "/images/user-images/LittleGemLettuce.png",
      ]);
  },
});

Template.marketplace.onDestroyed(function() {
  $('.popoverThis').popover('hide');
});

Template.marketplace.onRendered(function() {
  $('.popoverThis').popover({
      html: true,
      title: 'Add to Cart <a class="close">&times;</a>',
      content: $('.popoverContent').html(),
  });
  $('.popoverThis').popover();
  
  $('.popoverThis').click(function (e) {
      e.stopPropagation();
  });
  
  $(document).click(function (e) {
      if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
          $('.popoverThis').popover('hide');
      }
  });
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

    Meteor.call('addCartItem', item, function(error, result) { 
      $('.popoverThis').popover('hide');
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
