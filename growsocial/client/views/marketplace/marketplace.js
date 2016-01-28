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

Template.marketplace.onRendered(function() {
  $('.popoverThis').popover({
      html: true,
      title: 'Add to Cart <a class="close">&times;</a>',
      content: $('.popoverContent').html(),
  });
  
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
});

function marketNotify(alertType, message) {
  var div = '<div class="row"><div class="alert ' + 
    alertType + 
    ' alert-dismissible col-md-6 col-sm-6 col-xs-12" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
    message + 
    '</div></div>';
  $('#marketNotifyDiv').after(div);
}
