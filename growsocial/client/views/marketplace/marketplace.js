Template.marketplace.helpers({
  // "selectedProduct" is the currently selected product, could be none selected.
  
  // There will also be a list of other available products,
  // depending on whether showing general marketplace, or storefront for
  // a particular business or a particular person.
  productList : [{
    productId: 1,
    name: "Aunt Ruby's Green Tomato",
    pic: "/images/user-images/AuntRubyTomato.png",
  }, {
    productId: 2,
    name: "Scarlet Nantes Carrot",
    pic: "/images/user-images/ScarletNantesCarrot.png",
  }, {
    productId: 3,
    name: "Little Gem Lettuce",
    pic: "/images/user-images/LittleGemLettuce.png",
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
      title: 'Add to Cart <a class="close");">&times;</a>',
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
