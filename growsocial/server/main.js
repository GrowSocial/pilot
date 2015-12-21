Meteor.startup(function () {

return; // remaining code below, for seeding test collections 



/* Code block::
   will empty these collections:
    People.remove({});
    Member_Reviews.remove();
    MarketItems.remove({});
    Member_Videos.remove({});
    Member_Pictures.remove({});

and seed database with initial documents for each

                                                                   */

Member_Videos.remove({});
var sData = [
{member_key:'pseudo_1',submission_date:Date(),caption:'vid 1',
 video:''}, 
{member_key:'pseudo_1',submission_date:Date(),caption:'vid 2',
 video:''},
];
_.each(sData, function(sItem) 
  { Member_Videos.insert(sItem);

  }     );

Member_Pictures.remove({});
var sData = [
{member_key:'pseudo_1',submission_date:Date(),caption:'pic 1',
 picture:''}, 
{member_key:'pseudo_1',submission_date:Date(),caption:'pic 2',
 picture:''},
];
_.each(sData, function(sItem) 
  { Member_Pictures.insert(sItem);

  }     );



People.remove({});
var sData = [
{
member_key: 'pseudo_3', 
email: 'deep-end@me.com',
firstname:'Arthur',
lastname: 'Stripe',
fullname:'Arthur Stripe',
    street:'89 Higherstill Dr.', 
    street2:'',
    city:'Micanopy',
    state:'FL',
  zipcode:'34000',
  occupations: [ {vocation: 'Carpenter', descript:'Journeyman'},    
                 {vocation: 'Aquaponics',descript:'Designer'}               
               ],  
  location:'North Florida, FL',
  phone:'704 999-0100',
  website:'www.buildaquaponics.com',
  links:'gg.Aquaponics-today.rr{',
  facebookID:'',
  twitterID:'@artaqua',
  instagramID:'',
  about:'Fishes in yer tank, closed cycle!'
},

{
member_key: 'pseudo_2',
email: 'jessie@me.com',
firstname:'Jessica',
lastname: 'Jones',
fullname:'Jessica Jones',
occupations: [  {vocation: 'Owner', descript: 'Om Wellness Center'},    
                {vocation: 'Yoga Instructor'},   
                {vocation: 'Massage Therapist', descript:'LMT'}
              ],
 location:'Sunrise, FL',
 zipcode:'39000',
 about:'~ Whynot doYoga!'
},
{
member_key: 'pseudo_1', 
email: 'tony@me.com',
firstname:'Anthony',
lastname: 'Anderson',
fullname:'Anthony Anderson',
    street:'89 High Cliff Dr.', 
    street2:'',
    city:'Ft. Lauderdale',
    state:'FL',
  zipcode:'39000',
  occupations: [ {vocation: 'Farmer', descript: ''},    
                 {vocation: 'Beekeeper'},   
                 {vocation: 'Massage Therapist', descript: '(self taught)'}
           ],  
  location:'Ft. Lauderdale, FL',
  phone:'704 999-0000',
  website:'www.tonyAfarmer.com',
  links:'gg.web.hot.blog{',
  facebookID:'',
  twitterID:'@tonyA',
  instagramID:'',
  about:'Natural farming, baby!'
},





/* member_key pseudo_0  *********************************
 used by system to integrate new members with appropriate 
 greetings and interactive data
 */
{
member_key: 'pseudo_0', 
email: 'admin@growsocial.com',
firstname:'Grow',
lastname: 'Social',
fullname:'Grow Social',
    street:'123 Main St..', 
    street2:'',
    city:'Wilmington',
    state:'DE',
  zipcode:'02001',

  location:'Davie, FL',
  phone:'700 999-0000',
  website:'www.growsocial.com',
  links:'gg.web.site',
  facebookID:'',
  twitterID:'@grow',
  instagramID:'',
  about:"The Locavore's friend"
}
];

_.each(sData, function(sItem) 
  { People.insert(sItem);

  }     );




Member_Reviews.remove({});;
var sData = [
// first timestamp```````````````````````````````````````````````
{
member_key:'pseudo_1',review_by:'pseudo_2',
review_date:Date(),review_text:'sample from P2 for P1 (older post) ',review_rating:4
},
{
member_key:'pseudo_1',review_by:'pseudo_3',
review_date:Date(),review_text:'sample from P3 for P1 (older post) ',review_rating:3
}
,
{
member_key:'pseudo_2',review_by:'pseudo_3',
review_date:Date(),review_text:'sample from P3 for P2 (older post)  -Jessie floats my boat',review_rating:4
},
{
member_key:'pseudo_2',review_by:'pseudo_1',
review_date:Date(),review_text:'sample from P1 for P2 (older post) ',review_rating:1
}
,
{
member_key:'pseudo_3',review_by:'pseudo_2',
review_date:Date(),review_text:"sample from P2 for P3 (older post) ",review_rating:5
}
];
_.each(sData, function(sItem) 
	{ Member_Reviews.insert(sItem);

	}     );
/*  concept for test specific records present or not -- useful for reset seed datasets
 _.each(sData, 
        function(sItem) {
          var d = sData[0]; //entire document
          console.log(d.slice(13,8)); //portion containing the member_key datum
                        if ( People.find({member_key: d}).count() === 0 ) 
                             { People.insert(sItem); }

                        }
        );
*/

// second timestamp```````````````````````````````````````````````
Meteor._sleepForMs(2000); //timestamp for next group will be 2 seconds later

var sData = [
{
member_key:'pseudo_1',review_by:'pseudo_2',review_date:Date(),
review_text:'sample from P2 for P1 (latest post ',review_rating:4
},
{
member_key:'pseudo_1',review_by:'pseudo_3',review_date:Date(),
review_text:'sample from P3 for P1 (latest post ',review_rating:3
}
,
{
member_key:'pseudo_2',review_by:'pseudo_3',review_date:Date(),
review_text:'sample from P3 for P2 (latest post  -Jessie floats my boat',review_rating:4
},
{
member_key:'pseudo_2',review_by:'pseudo_1',review_date:Date(),
review_text:'sample from P1 for P2 (latest post ',review_rating:1
},
{
member_key:'pseudo_3',review_by:'pseudo_2',review_date:Date(),
review_text:"sample from P2 for P3 (latest post ",
review_rating:5
}
];
_.each(sData, function(sItem) 
	{ Member_Reviews.insert(sItem);

	}     );



MarketItems.remove({});
var sData = [
 { vendor_key: 'pseudo_3', 
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
			{description:'Turnips', 
					type:'Produce',
			  salesAlert:'only 700 left',
				unitType:'Ea.',
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
{vendor_key: 'pseudo_1', 
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



_.each(sData, function(sItem) 
  { MarketItems.insert(sItem);

  }     );


 /* ************************************************ end   Code block:: (initialize database)*/







}); //Meteor.startup(function ()
