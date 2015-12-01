Meteor.methods({

	// Add to shopping cart collection
	addCartItem: function() {
		// var item = {
		// 	quantity: cartItem.quantity,
		// 	description: cartItem.description,
		// 	unitType: cartItem.unitType,
		// 	unitPrice: cartItem.unitPrice,
		// 	currency: cartItem.currency,
		// 	itemTotalPrice: cartItem.itemTotalPrice,
		// 	vendorUserId: cartItem.vendorUserId,
		// 	vendorName: cartItem.vendorName
		// }

		var item = {
			quantity: 4,
			description: "Small Millet",
      		unitType: "pounds",
			unitPrice: 4.20,
			currency: 'USD',
			itemTotalPrice: 63.60,
			vendorBusinessId: 23,
			vendorName: 'Us',
		}

		console.log(item);
		ShoppingCart.insert(item);
	}


});
