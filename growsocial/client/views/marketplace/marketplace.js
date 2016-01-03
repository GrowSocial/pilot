Template.marketplace.helpers({
  // "selectedProduct" is the currently selected product, could be none selected.
  
  // TODO There will also be a list of other available products,
  // depending on whether showing general marketplace, or storefront for
  // a particular business or a particular person.
  
  // TODO pull product list from the database
  
  productList : [{
    productId: '1',
    name: "Aunt Ruby's Green Tomato",
    description: "Aunt Ruby's Green Tomato, grown with care in Aunt Ruby's bathtub",
    pic: "/images/user-images/AuntRubyTomato.png",
    unitType: "each",
    unitPrice: 2.20,
    currency: 'USD',
    vendorUserId: '2',
    vendorName: 'Anthony Apple',
    vendorLink: '/profile/2',
    vendorEmail: 'anthonyapple@notarealemail.com',
  }, {
    productId: '2',
    name: "Scarlet Nantes Carrot",
    description: "Scarlet Nantes Carrot, seeded by throwing seeds in the air at random",
    pic: "/images/user-images/ScarletNantesCarrot.png",
    unitType: "pound",
    unitPrice: 1.50,
    currency: 'USD',
    vendorBusinessId: '2',
    vendorName: 'XYZ Compost Removal',
    vendorLink: '/business/2',
    vendorEmail: 'xyz@notarealemail.com',
  }, {
    productId: '3',
    name: "Little Gem Lettuce",
    description: "Little Gem Lettuce, sparkles like emeralds",
    pic: "/images/user-images/LittleGemLettuce.png",
    unitType: "5 pound bag",
    unitPrice: 10.50,
    currency: 'USD',
    vendorBusinessId: '2',
    vendorName: 'XYZ Compost Removal',
    vendorLink: '/business/2',
    vendorEmail: 'xyz@notarealemail.com',
  }],
  
  selectedProduct: function() {
    var productId = FlowRouter.getParam("productId");
    console.log("This is my selected product: ", productId);
    if (productId && productId !== '0') {
      return productId;
    } else {
      return [];
    }
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
