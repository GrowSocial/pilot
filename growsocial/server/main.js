Meteor.startup(function () {

//  var sData  for 'seed data'

/**
 * Initialize if empty.
 */
 
//MarketItems.remove({});
var sData = [
 { vendor_key: 'pseudo_86', 
    items: [ 
			{description:'Mustards', 
					type:'Produce',
			  salesAlert:'only 10 left',
				unitType:'bunch',
			   unitPrice: 3.00,
				currency:'USD',
			},  
			{description:'Collards', 
					type:'Produce',
			  salesAlert:'only 20 left',
				unitType:'bunch',
			   unitPrice: 2.00,
				currency:'USD',
			}, 
			{description:'Carrots', 
					type:'Produce',
			  salesAlert:'',
				unitType:'Lb.',
			   unitPrice: 1.00,
				currency:'USD',
			} 
   		]
} ,
{vendor_key: 'pseudo_88', 
  items: [ 
			{description:'String Beans', 
					type:'Produce',
			  salesAlert:'only 10 left',
				unitType:'basket',
			   unitPrice: 3.00,
				currency:'USD',
			},  
			{description:'Cucumbers', 
					type:'Produce',
			  salesAlert:'only 20 lbs. left',
				unitType:'Lb.',
			   unitPrice: 2.00,
				currency:'USD',
			}, 
			{description:'Cilantro', 
					type:'Herbs',
			  salesAlert:'',
				unitType:'Lb.',
			   unitPrice: 1.82,
				currency:'USD',
			} 
   		]
  } 		
];  
if (MarketItems.find().count() === 0) {
    _.each(sData, function(mItem) 
   	{ MarketItems.insert(mItem);}
   );
}



//Member_Videos.remove({});
var sData = [
{member_key:'pseudo_1',submission_date:Date(),caption:'vid 1',
 video:''}, 
{member_key:'pseudo_1',submission_date:Date(),caption:'vid 2',
 video:''},
];
if (Member_Videos.find().count() === 0) {
    _.each(sData, function(sItem) 
   	{ Member_Videos.insert(sItem);}     );
}



//Member_Pictures.remove({});
var sData = [
{member_key:'pseudo_1',submission_date:Date(),caption:'pic 1',
 picture:''}, 
{member_key:'pseudo_1',submission_date:Date(),caption:'pic 2',
 picture:''},
];
if (Member_Pictures.find().count() === 0) {
    _.each(sData, function(sItem) 
   	{ Member_Pictures.insert(sItem);}     );
}



//Member_Reviews.remove({});
var sData = [
{member_key:'pseudo_1',
review_by:'pseudo_2',review_date:Date(),
review_text:'bla bla bla',review_rating:4
},
{member_key:'pseudo_1',
review_by:'pseudo_3',review_date:Date(),
review_text:'bla bla bla',review_rating:3
}
];
if (Member_Reviews.find().count() === 0) {
    _.each(sData, function(sItem) 
   	{ Member_Reviews.insert(sItem);}     );
}


//People.remove({});
var sData = [
{
member_key: 'pseudo_2',
email: 'jessie@me.com',
firstname:'Jessica',
lastname: 'pseudo_2',
fullname:'Jessica pseudo_2',
occupations: [  {vocation: 'Owner', descript: 'Om Wellness Center'},    
   				{vocation: 'Yoga Instructor'},   
   				{vocation: 'Massage Therapist','LMT'}
   			 ],
zipcode:'39000',
about:'~ Whynot doYoga!'
},

{
member_key: 'pseudo_1', 
email: 'tony@me.com',
firstname:'Anthony',
lastname: 'pseudo_2',
fullname:'Anthony pseudo_2',
  	street:'89 High Cliff Dr.', 
  	street2:'',
  	city:'Ft. Lauderdale',
  	state:'FL',
 	zipcode:'39000',
	occupations: [  {vocation: 'Farmer', descript: ''},    
   				    {vocation: 'Beekeeper'},   
   					{vocation: 'Massage Therapist'}
   				 ],
	location:'Ft. Lauderdale, FL',
	phone:'704 999-0000',
	website:'www.tonyAfarmer.com',
	links:'',
	facebookID:'',
	twitterID:'@tonyA',
	instagramID:'',
	about:'Natural farming, baby!'
}
];

if (People.find().count() === 0) {
    _.each(sData, function(sItem) 
   	{ People.insert(sItem);}     );
}

//if (Items.find().count() === 0) {
//    _.each([ "Hat","Shoes", "Coat", "Gloves", "Socks", "Sweater", "T-shirt"],
//    	    function (name) {   Items.insert({name: name});}
//    		);
// }

Buisness.remove({})
Buisness.insert({bizEmail: 'bb@moo2.com', bizName: 'BarnNails' });
//alert(Bizness.find().count());



}); //Meteor.startup(function ()
