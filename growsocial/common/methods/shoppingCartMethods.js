Meteor.methods({
	// Add to shopping cart collection
	addCartSampleItems: function() {

		var order = {
			userId: Meteor.userId(),
			vendorName: "Missy's Backyard Pride",
			vendorEmail: 'email@vendor.sample',
			vendorUserId: 1,
			vendorBusinessId: null,
			vendorTotal: 75.10,
			products: [{
				quantity: 3,
				description: "Grandma's Heirloom Tomato",
				unitType: "pound",
				unitPrice: 4.20,
				currency: 'USD',
				itemTotalPrice: 63.60,
			}, {
				quantity: 0.5,
				description: "Dad's Ghost Chilies",
				unitType: "pound",
				unitPrice: 3.00,
				currency: 'USD',
				itemTotalPrice: 1.50,
			}, {
				quantity: 2,
				description: "Louise's Famous Strawberry Jam",
				unitType: "bottle",
				unitPrice: 5.00,
				currency: 'USD',
				itemTotalPrice: 10.00,
			}]
		}
		console.log('adding cart sample order:', order);
		ShoppingCart.insert(order);
	},

	// Add to shopping cart collection
	addCartItem: function(item) {

	    // TODO update current order if there is one
	    // TODO vendorEmail won't be exposed to the client (browser)
	    // TODO when not logged in, add session id

	    // Create the product structure
    	var product = {
    		productId: item.productId,
			name: item.name,
			description: item.description,
			pic: item.pic,
			currency: item.currency,
			unitType: item.unitType,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			itemTotalPrice: item.quantity * item.unitPrice,
    	}

	    // TODO add up product totals for vendorTotal
	    var vendorTotal = product.itemTotalPrice;
	    
	    // Create the order structure
	    var order = {
	      userId: Meteor.userId(),
	      //sessionId: ,
	      vendorUserId: item.vendorUserId,
	      vendorBusinessId: item.vendorBusinessId,
	      vendorName: item.vendorName,
	      vendorLink: item.vendorLink,
	      vendorEmail: item.vendorEmail,
	      vendorTotal: vendorTotal,
	      products: [ product, ],
	    }

	    // Check if vendor already exists in collection
    	// if (!Meteor.call('checkForVendor', order)) {
    	// 	ShoppingCart.insert(order);
    	// }
    	// else {
    	// 	// Check if the product exists inside the order and if it does update it with new quantity.
    	// 	// If product doesnt exist, add it to the products array
    	// }
    	console.log(ShoppingCart.find({}).fetch());
	},

	checkForVendor: function(_order) {
		
		if (ShoppingCart.findOne({vendorUserId: _order.vendorUserId}) ||
			ShoppingCart.findOne({vendorBusinessId: _order.vendorBusinessId})) {
			return true;
		};
		return false;
	},

	removeFromCart: function(order) {
		if (true) {};
	},

});
