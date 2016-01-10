Meteor.methods({

  addMarketSampleProducts: function() {

    var addedList = []; // stores just the product names to report back

    // choose a vendor
    var vendor = Random.choice([
      {
        vendor_key: '2',
        vendorUserId: '2',
        vendorName: 'Anthony Apple', 
        vendorLink: '/profile/2',
        vendorEmail: 'anthonyapple@notarealemail.com',
      }, {
        vendor_key: '3',
        vendorUserId: '3',
        vendorName: 'Barnaby Banana',
        vendorLink: '/profile/3',
        vendorEmail: 'barneyb@notarealemail.com',
      }, {
        vendor_key: '4',
        vendorBusinessId: '4',
        vendorName: 'XYZ Compost Removal',
        vendorLink: '/business/2',
        vendorEmail: 'xyz@notarealemail.com',
      },
    ]);
    
    vendor.items = [];
    vendor.testDataMarket = true;
    
    // add products to the vendor
    for (var i = 0; i < 3; i++) {

      // choose a set of product details
      var product = Random.choice([
        {
          productId: '1',
          name: "Aunt Ruby's Green Tomato",
          description: "Aunt Ruby's Green Tomato, grown with care in Aunt Ruby's bathtub",
          pic: "/images/user-images/AuntRubyTomato.png",
        }, {
          productId: '2',
          name: "Scarlet Nantes Carrot",
          description: "Scarlet Nantes Carrot, seeded by throwing seeds in the air at random",
          pic: "/images/user-images/ScarletNantesCarrot.png",
        }, {
          productId: '3',
          name: "Little Gem Lettuce",
          description: "Little Gem Lettuce, sparkles like emeralds",
          pic: "/images/user-images/LittleGemLettuce.png",
        },
      ]);

      // add other product details
      product.type = 'produce';
      product.currency = 'USD';
      product.unitType = Random.choice(["each", "5 pound bag", "pound", "gallon jar"]);
      product.unitPrice = Random.choice([2.20, 5.50, 3.21, 1.00, 7.99]);
      
      // assign the product to the vendor
      vendor.items.push(product);
      
      // list of products added
      addedList.push(product.name);
      // console.log('for marketplace, adding sample product:', product);
      
    }
    // insert to database
    MarketItems.insert(vendor);
    
    // console.log('method, addedList:', addedList);
    return addedList; // passed through client callback
  },
  
  removeMarketSampleProducts: function() {
    MarketItems.remove({testDataMarket: true});
  },
});
