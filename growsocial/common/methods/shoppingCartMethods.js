Meteor.methods({

	// Add to shopping cart collection
	addCartItem: function() {

		var item = {
			vendorName: "Missy's Backyard Pride",
			vendorUserId: 1,
			vendorBusinessId: null,
			products: [{
				quantity: 3,
				description: "Grandma's Heirloom Tomato",
	      		unitType: "Pounds",
				unitPrice: 4.20,
				currency: 'USD',
				itemTotalPrice: 63.60,
			}, {
				quantity: 0.5,
				description: "Dad's Ghost Chilies",
				unitType: "Pounds",
				unitPrice: 3.00,
				currency: 'USD',
				itemTotalPrice: 1.50,
			}, {
				quantity: 2,
				description: "Louise's Famous Strawberry Jam",
				unitType: "Bottle",
				unitPrice: 5.00,
				currency: 'USD',
				itemTotalPrice: 10.00,
			}]
		}

		console.log(item);
		ShoppingCart.insert(item);
	}


});
