UI.registerHelper('formatTime', function(context, options) {
  if(context)
    return moment(context).format('MM/DD/YYYY, hh:mm');
});
/* never worked ~~~~~~ see UI.registerHelper('formatTime' (in use)
formatRevDate: function() {
  var d = this.review_date;
  return monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  //moment(date).format('MM-DD-YYYY');
},
*/

// for testing , Dec 2015
UI.registerHelper('reviewCount', function(context, options) {
  var mKey = FlowRouter.getParam('personId');
  var myCount = Member_Reviews.find({member_key: mKey}).count() - 1;
  if(context)
    return myCount;
});


/* ~!
The default _id field is already keyed by creation time 
(see: how Mongo ObjectIDs are generated). 
You can just sort that in reverse order without having to add another field.
*/

Template.MyMarketItems.helpers({

selectMarketItems: function() {
  /* BIG LESSON .  find() does not work;   findOne() works. Why?
    According to Weldon, .fetch() is needed ..  
    but that does not qualify find() to work. Not here anyway 
   GO AHEAD try for yourself.  This is some of the ENORMOUS time necessary to
    understand Meteor well enough to put it to work, in even an intermediately simple app.
  ~
  find() will read the DB and provide information here in the helper ;  
  but it does not provide to a spacebars client in a template.
  findOne() is the only way I have been able to do this.
  */

    var mKey = FlowRouter.getParam('personId');
    var count= MarketItems.find({vendor_key: mKey}).count();
    var items = MarketItems.findOne({vendor_key: mKey}) || {};
    //alert('selectMarketItems: function() {'+ mKey+ "~"+count);
    return items;
  },
});




Template.MemberReviews.onCreated(function() { var self = this;
  self.autorun(function() { 

  var member_Key = FlowRouter.getParam('personId');
//alert('Template.MemberReviews.onCreated('+ member_Key);

/*  if getLatestReviews is called , 
#if Template.subscriptionsReady   is never true. ?!
self.subscribe('getLatestReviews', member_Key);


// thisdoesn't matter either: 
// although it does not halt @ Template.subscriptionsReady status
 self.subscribe('Member_Reviews-Set', member_Key);

*/

  });
});
Template.MemberReviews.helpers({


summrizeStats: function() { //http://stackoverflow.com/questions/28052666/summing-a-column-in-a-table-in-meteor
  var mKey = FlowRouter.getParam('personId');
  var myCount = Member_Reviews.find({member_key: mKey}).count();
  var myRevws = Member_Reviews.find({member_key: mKey});
  var mappedItems = myRevws.map((function(myRevws) {return myRevws.review_rating;}));
  var total = _.reduce(mappedItems, function(memo, num){ return memo + num; }, 0);
  var myAvg = total / myCount; //alert("allReviews"+total);
  //Session.set("avgRating", myAvg); // for testing 
  //alert(mKey +" reviews "+  myCount + " scoreTot "+total);
  return myAvg + ' Stars | in ' + myCount + ' Reviews';
},


/* for loading lastest member reviews
*/
selectLatest_Review: function() {
    var mKey = FlowRouter.getParam('personId');
    var member = Member_Reviews.findOne({member_key: mKey}, {sort: {review_date: -1} }) || {};
    latestReviewID=member._id; //global?
    //alert("latest review hash id " + member._id);
    return member;
  },
selectNext_Review: function(current) {
//alert("select second review " + latestReviewID);
//var current=this._id;
    //var mKey = FlowRouter.getParam('personId');
    var member = Member_Reviews.findOne({_id: {$ne: latestReviewID} }, {sort: {review_date: -1} }) || {};
    //var count = Member_Reviews.findOne({_id: {$ne: current} }, {sort: {review_date: -1} }) || {};
  //alert('next count '+count);
    return member;
  },
reviewCount: function() {
    var mKey = FlowRouter.getParam('personId');
    var count = Member_Reviews.find({member_key: mKey}).count();
    //alert(count);
    return false;
  },
latestReviews: function () { 
  var MAX_RESULTS = 2;
  var mKey = FlowRouter.getParam('personId');
  var mSet=Member_Reviews.find( {member_key: mKey}, 
                        {limit: limit || MAX_RESULTS, 
                          sort: {review_date: -1} }     );
    return mSet;
},

ReviewedBy: function() {
    var review = this;
    var member = People.findOne({member_key: review.review_by}) || {};
    //alert('Template.MemberReviews.helpers('+ member.fullname);
    return member.fullname;
  },

starburst: function (rating) {  //var rating = this.review_rating;
    switch (rating)
    {
      case 2: var rated="2"; break;
      case 3: var rated="3"; break;
      case 4: var rated="4"; break;
      case 5: var rated="5"; break;
      default: var rated="";
    }
    var filespec="/images/icons/" + rated + "starYellow.png";
    return {  id : "star-icon", src : filespec, class:"image" }
  }
});




Template.profile.onCreated(function() 
  { var self = this;

  self.autorun(function() 
    { var member_Key = FlowRouter.getParam('personId');
      self.subscribe('oneProfileRec', member_Key); 

  //alert('Template.profile.onCreated('+ member_Key); 
  }
  );







//see  /server/main.js for documentation
//  We need to be sure this document is present in People collection
//
var AdminInitialized = People.find({member_key: 'pseudo_0'}).count();

//alert('AdminInitialized finding:' + AdminInitialized);

if (AdminInitialized == 0) { //alert('Admin assessed & initializing:');
var sData = [
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

} // end if





}); //on created 'profile'


Template.profile.helpers({


myProfile: function(){
//Will return NULL if no member is logged in, 
//            FALSE if another member is here to view 
//
var mKey = FlowRouter.getParam('personId');
//alert(Accounts.userId()+'~'+mKey);
    if (Accounts.userId() == mKey) { return true }      
                              else { return false;}    
},

selectProfile: function() {
    var mKey = FlowRouter.getParam('personId');
    var member = People.findOne({member_key: mKey}) || {};
    //alert('Template.profile.helpers('+ mKey);
    return member;
  },

there_are_items: function(caller){
    var mKey = FlowRouter.getParam('personId');
    switch (caller)
    {
      case 'pictures': var count= Member_Pictures.find({member_key: mKey}).count();
        break;
      case 'videos': var count= Member_Videos.find({member_key: mKey}).count(); 
        break;
      case 'marketItems': var count= MarketItems.find({vendor_key: mKey}).count();
        break;
      default: var count=0;
    }
    //alert(mKey + caller + count);
    if (count) { return true }       //alert('true');
          else { return false;}      //alert('false');
  },


itemsOverflow: function(){
    var mKey = FlowRouter.getParam('personId');
    var count= MarketItems.find({vendor_key: mKey}).count();
    if (count>5) { return true } else { return false;}
  },


/* ver 00.01 /Misha
    // TODO retrieve person details from collection
    if (personId == 1) {
      return {
        personId: personId,
        name: "Jane",
        pic: "/images/user-images/jane.png",
        coverPhoto: "/images/newsfeed-hdr1366-192.jpg",
        rolesShort: "Grape Picker",
        rolesFull: "Grape Picker",
        location: "Miami, FL",
        };
    } else {
      return {
        personId: personId,
        name: "Anyone at all",
        pic: "/images/user-images/anthony.jpg",
        coverPhoto: "/images/user-images/owl.jpg",
        rolesShort: "Local Occupation",
        rolesFull: "",
        location: "Yourtown, Earth",
        };
    };

*/

/* ver 00.01 /Misha
  postList: function() {
    var personId = FlowRouter.getParam("personId");
    // TODO retrieve person details from collection
    if (personId == 2) {
      return [{
          icon: "/images/user-images/profile-anthony.jpg",
          datePosted: "Jan 15",
          message: "Time to grab your shovels, it is composting season!",
        }, {
          icon: "/images/user-images/profile-anthony.jpg",
          datePosted: "Jan 12",
          message: "Beautiful maggots are in my compost bin, I promise to share a pic, yummy.",
        }, 
      ];
    }
  }
*/


});
