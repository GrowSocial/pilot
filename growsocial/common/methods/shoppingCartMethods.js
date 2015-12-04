Meteor.methods({

	// Add to shopping cart collection
	addCartItem: function() {

		var item = {
			vendorName: "Big Millet",
			vendorUserId: 1,
			vendorBusinessId: null,
			products: [{
				quantity: 4,
				description: "Small Millet",
	      		unitType: "pounds",
				unitPrice: 4.20,
				currency: 'USD',
				itemTotalPrice: 63.60,
			}, {
				quantity: 3,
				description: "Big Millet",
				unitType: "pounds",
				unitPrice: 2.20,
				currency: 'USD',
				itemTotalPrice: 6.60,
			}]
		}

		console.log(item);
		ShoppingCart.insert(item);
	}


});
