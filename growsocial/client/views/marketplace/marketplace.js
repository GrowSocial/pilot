Template.marketplace.helpers({
  // "selectedProduct" is the currently selected product, could be none selected.
  
  // TODO There will also be a list of other available products,
  // depending on whether showing general marketplace, or storefront for
  // a particular business or a particular person.
  
  // TODO pull product list from the database
  
  productList : [{
    productId: '1',
    description: "Aunt Ruby's Green Tomato",
    pic: "/images/user-images/AuntRubyTomato.png",
    unitType: "each",
    unitPrice: 2.20,
    currency: 'USD',
    vendorUserId: '2',
    vendorName: 'Anthony Apple',
    vendorLink: '/profile/2',
  }, {
    productId: '2',
    description: "Scarlet Nantes Carrot",
    pic: "/images/user-images/ScarletNantesCarrot.png",
    unitType: "pounds",
    unitPrice: 1.50,
    currency: 'USD',
    vendorBusinessId: '2',
    vendorName: 'XYZ Compost Removal',
    vendorLink: '/business/2',
  }, {
    productId: '3',
    description: "Little Gem Lettuce",
    pic: "/images/user-images/LittleGemLettuce.png",
    unitType: "5 pound bag",
    unitPrice: 10.50,
    currency: 'USD',
    vendorBusinessId: '2',
    vendorName: 'XYZ Compost Removal',
    vendorLink: '/business/2',
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
