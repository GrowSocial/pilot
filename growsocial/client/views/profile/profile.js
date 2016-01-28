

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
  if(context) return myCount;
});


/* ~!
The default _id field is already keyed by creation time 
(see: how Mongo ObjectIDs are generated). 
You can just sort that in reverse order without having to add another field.
*/


Template.addComment.helpers({

});
Template.addComment.events({
  'submit form': function(){ event.preventDefault();
    var mKey = FlowRouter.getParam('personId');
    var commentTEXT = event.target.comment.value;
      console.log(commentTEXT);
    Comments.insert({        
      member_key: mKey,
      commentBy: Accounts.userId(),
         comment: commentTEXT,
       timestamp: Date(),
       commentSource:"PROFILE PAGE",
      });
    $('.add-post-form')[0].reset(); //http://stackoverflow.com/questions/20760368/how-to-reset-a-form-in-meteor
  }

});




Template.MyMarketItems.helpers({

  selectMarketItems: function() {
    /* BIG LESSON .  find() does not work;   findOne() works. Why?
      According to Weldon, .fetch() is needed ..  
      but that does not qualify find() to work. Not here anyway  
    ~
    find() will read the DB and provide information here in the helper ;  
    but it does not provide to a spacebars client in a template.
    findOne() is the only way I have been able to do this.
    */

      var mKey = FlowRouter.getParam('personId');
      var count= MarketItems.find({vendor_key: mKey}).count();
      var items = MarketItems.findOne({vendor_key: mKey}) || {};
    //alert('selectMarketItems: function() {'+ mKey+ "~" + count);
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
    }
    );


    //see  /server/main.js for documentation
    //  We need to be sure Admin document is present in database
    // If not present (first time this is run on a server without data collections
    // initialization module ) insert record to collection People
    // 
    var AdminInitialized = People.find({member_key: "pseudo_0"}).count();

    /*ERROR:
    "" insert failed: MongoError: insertDocument :: caused by :: 11000 E11000 duplicate key error index: meteor.People.$c2_member_key  dup key: { : "pseudo_0" }

    Will occur if the Meteor session is interrupted, and resumed while the profile page is the current browser view.
    I believe it is because the 'People' instance has not been initialized 
    -- which normally happens when the application commences with the localhost:3000 root path
    Once a user navigates to 'People' from the navbar menu, 'People' is instanced.

    The error : follows the test to see if the 'pseudo_o' user (admin) is present in the database. 
    The JS returns a null as a result of :  AdminInitialized = People.find({member_key: "pseudo_0"}).count();
    if People has not been instanced..  

    This will only happen if the app starts with this template as the startup view
    We can revise the JS here, include error trapping perhaps, or test to be sure of the state of the session.
    OR: we turn to another approach altogether for being certain admin, 'psuedo_0' is present in database

    */


    if (AdminInitialized == 0) { 
    // Will be TRUE if People has not been loaded until now
    // irregardless of admin record present.
    // Can happen if the app restarts from the profile page and will cause a record insert exception.
    // No error handling is coded here, for now. Not sure if it is important, is not tested at deployed server
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
    _.each(sData, function(sItem)  { People.insert(sItem); }     
      );

    } // end if -- Admin check

}); //on created 'profile'


Template.profile.helpers({
  myProfile: function(){
    //Will return NULL if no member is logged in, 
    //            FALSE if another member is here to view selected profile
    //            TRUE if a logged in member is navigating to their profile page
    var mKey = FlowRouter.getParam('personId');
    if (Accounts.userId() == mKey) { return true }  else { return false;}    
  },

  selectProfile: function() {
      var mKey = FlowRouter.getParam('personId');
      var member = People.findOne({member_key: mKey}) || {};
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

        case 'blogEntries': var count=0;
        case 'calendarEvents': var count=0;
        case 'memberContacts': var count=0;      
        default: var count=0;
      }  
      //alert(mKey + caller + count);
      if (count) { return true } else { return false;}
    },

  itemsOverflow: function(){
      var mKey = FlowRouter.getParam('personId');
      var count= MarketItems.find({vendor_key: mKey}).count();
      if (count>5) { return true } else { return false;}
    },

  myMarketItems: function() {

      var mKey = FlowRouter.getParam('personId');
      var items = MarketItems.findOne({vendor_key: mKey}) || {};
    //alert('myMarketItems: function() {'+ mKey );
      return items;
    },

  initMarketItems: function(){

  var mKey = FlowRouter.getParam('personId');
  var member = People.findOne({member_key: mKey}) || {};
  //alert("intiial MItem for " + member.fullname + Date());
  var sData = [{vendor_key: mKey, 
              vendorUserId: mKey,
                vendorName: member.fullname,
               vendorEmail: member.email,
            testDataMarket: false,
    items: [   {name:'Market Item', description:'', 
                type:'',
          salesAlert:'',
            unitType:'',
           unitPrice: 0,
            currency:'',
        date_entered: Date()
        }]
  }];  
  _.each(sData, function(sItem) { MarketItems.insert(sItem);});
  }

});




// for now, replicating profile onCreated & helpers to impliment mobile/desktop verion; 
//  Eventually, we should consolidate this and not repeat the functions in librbary
//

Template.profile_DESKTOP.onCreated(function() 
    { var self = this;

    self.autorun(function() 
      { var member_Key = FlowRouter.getParam('personId');
        self.subscribe('oneProfileRec', member_Key); 
    }
    );


    //see  /server/main.js for documentation
    //  We need to be sure Admin document is present in database
    // If not present (first time this is run on a server without data collections
    // initialization module ) insert record to collection People
    // 
    var AdminInitialized = People.find({member_key: "pseudo_0"}).count();

    /*ERROR:
    "" insert failed: MongoError: insertDocument :: caused by :: 11000 E11000 duplicate key error index: meteor.People.$c2_member_key  dup key: { : "pseudo_0" }

    Will occur if the Meteor session is interrupted, and resumed while the profile page is the current browser view.
    I believe it is because the 'People' instance has not been initialized 
    -- which normally happens when the application commences with the localhost:3000 root path
    Once a user navigates to 'People' from the navbar menu, 'People' is instanced.

    The error : follows the test to see if the 'pseudo_o' user (admin) is present in the database. 
    The JS returns a null as a result of :  AdminInitialized = People.find({member_key: "pseudo_0"}).count();
    if People has not been instanced..  

    This will only happen if the app starts with this template as the startup view
    We can revise the JS here, include error trapping perhaps, or test to be sure of the state of the session.
    OR: we turn to another approach altogether for being certain admin, 'psuedo_0' is present in database

    */


    if (AdminInitialized == 0) { 
    // Will be TRUE if People has not been loaded until now
    // irregardless of admin record present.
    // Can happen if the app restarts from the profile page and will cause a record insert exception.
    // No error handling is coded here, for now. Not sure if it is important, is not tested at deployed server
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
    _.each(sData, function(sItem)  { People.insert(sItem); }     
      );

    } // end if -- Admin check

}); //on created 'profile'


Template.profile_DESKTOP.events(
{

'click .connectSelect': function()
{ //console.log("You clicked CONNECT"); 
  var viewedMembr = FlowRouter.getParam('personId');//alert("initial MItem for " + member.fullname + Date());
  var loggedInMembr = Accounts.userId()
  var count =Connections.find({member_key: viewedMembr}).count();
  if ( count )
      {
        //alert("push new connection record into array within member's connections document");
      var sData = [{ contact: [{member_id:loggedInMembr, 
                                timestamp:Date(),
                                descript:'invitation'
                                }]
                  }];

  // not working , untrusted code error. Requires further code & design decisions to impliment, as well
  //      Connections.update({  member_key: viewedMembr }, { $push: sData }        );

 } else { 
  //alert("first record, establish document with first connection record "+viewedMembr+" by "+loggedInMembr );

        var sData = [
 { member_key: viewedMembr, 
    contact: [ 
      {member_id:loggedInMembr, 
       timestamp:Date(),
       descript:'invitation'
      }]
  }];
_.each(sData, function(sItem)  { Connections.insert(sItem); }     );
 // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`Connections.insert(sData);




}; // if

} //function

});  //template



Template.profile_DESKTOP.helpers({
  connectionActive: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var count =Connections.find({member_key: viewedMembr}).count();
    return count;
  },

  connectionPending: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var pending = Connections.find({member_key: viewedMembr, "contact.descript": 'invitation'}).count();
    //alert("connectionPending " + pending);
    return pending;
  },

  myProfile: function(){
    //Will return NULL if no member is logged in, 
    //            FALSE if another member is here to view selected profile
    //            TRUE if a logged in member is navigating to their profile page
    var mKey = FlowRouter.getParam('personId');
    if (Accounts.userId() == mKey) { return true }  else { return false;}    
  },

  selectProfile: function() {
      var mKey = FlowRouter.getParam('personId');
      var member = People.findOne({member_key: mKey}) || {};
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
        case 'connections': var count= Connections.find({member_key: mKey}).count();
          break;
        case 'blogEntries': var count=0;
        case 'calendarEvents': var count=0;
        case 'memberContacts': var count=0;      
        default: var count=0;
      }  
      //alert(mKey + caller + count);
      if (count) { return true } else { return false;}
    },

  itemsOverflow: function(){
      var mKey = FlowRouter.getParam('personId');
      var count= MarketItems.find({vendor_key: mKey}).count();
      if (count>5) { return true } else { return false;}
    },

  myMarketItems: function() {

      var mKey = FlowRouter.getParam('personId');
      var items = MarketItems.findOne({vendor_key: mKey}) || {};
    //alert('myMarketItems: function() {'+ mKey );
      return items;
    },

  initMarketItems: function(){

  var mKey = FlowRouter.getParam('personId');
  var member = People.findOne({member_key: mKey}) || {};
  //alert("intiial MItem for " + member.fullname + Date());
  var sData = [{vendor_key: mKey, 
              vendorUserId: mKey,
                vendorName: member.fullname,
               vendorEmail: member.email,
            testDataMarket: false,
    items: [   {name:'Market Item', description:'Market Item Description', 
                type:'produce',
          salesAlert:'',
            unitType:'pound',
           unitPrice: 0.99,
            currency:'USD',
        date_entered: Date(),
           productId: Random.id(),
        }]
  }];  
  _.each(sData, function(sItem) { MarketItems.insert(sItem);});
  }

});

















Template.profile_MOB.onCreated(function() 
  { var self = this;

  self.autorun(function() 
    { var member_Key = FlowRouter.getParam('personId');
      self.subscribe('oneProfileRec', member_Key); 
  }
  );


  //see  /server/main.js for documentation
  //  We need to be sure Admin document is present in database
  // If not present (first time this is run on a server without data collections
  // initialization module ) insert record to collection People
  // 
  var AdminInitialized = People.find({member_key: "pseudo_0"}).count();

  /*ERROR:
  "" insert failed: MongoError: insertDocument :: caused by :: 11000 E11000 duplicate key error index: meteor.People.$c2_member_key  dup key: { : "pseudo_0" }

  Will occur if the Meteor session is interrupted, and resumed while the profile page is the current browser view.
  I believe it is because the 'People' instance has not been initialized 
  -- which normally happens when the application commences with the localhost:3000 root path
  Once a user navigates to 'People' from the navbar menu, 'People' is instanced.

  The error : follows the test to see if the 'pseudo_o' user (admin) is present in the database. 
  The JS returns a null as a result of :  AdminInitialized = People.find({member_key: "pseudo_0"}).count();
  if People has not been instanced..  

  This will only happen if the app starts with this template as the startup view
  We can revise the JS here, include error trapping perhaps, or test to be sure of the state of the session.
  OR: we turn to another approach altogether for being certain admin, 'psuedo_0' is present in database

  */


  if (AdminInitialized == 0) { 
  // Will be TRUE if People has not been loaded until now
  // irregardless of admin record present.
  // Can happen if the app restarts from the profile page and will cause a record insert exception.
  // No error handling is coded here, for now. Not sure if it is important, is not tested at deployed server
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
  _.each(sData, function(sItem)  { People.insert(sItem); }     
    );

  } // end if -- Admin check

}); //on created 'profile'

Template.profile_MOB.events({

  'click .connectSelect': function(){
      console.log("clicked CONNECT button");



    }

});

Template.profile_MOB.helpers({
    connectionActive: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var count =Connections.find({member_key: viewedMembr}).count();
    return count;
  },

  connectionPending: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var pending = Connections.find({member_key: viewedMembr, "contact.descript": 'invitation'}).count();
    //alert("connectionPending " + pending);
    return pending;
  },

  myProfile: function(){
    //Will return NULL if no member is logged in, 
    //            FALSE if another member is here to view selected profile
    //            TRUE if a logged in member is navigating to their profile page
    var mKey = FlowRouter.getParam('personId');
    if (Accounts.userId() == mKey) { return true }  else { return false;}    
  },

  selectProfile: function() {
      var mKey = FlowRouter.getParam('personId');
      var member = People.findOne({member_key: mKey}) || {};
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

        case 'blogEntries': var count=0;
        case 'calendarEvents': var count=0;
        case 'memberContacts': var count=0;      
        default: var count=0;
      }  
      //alert(mKey + caller + count);
      if (count) { return true } else { return false;}
    },

  itemsOverflow: function(){
      var mKey = FlowRouter.getParam('personId');
      var count= MarketItems.find({vendor_key: mKey}).count();
      if (count>5) { return true } else { return false;}
    },

  myMarketItems: function() {

      var mKey = FlowRouter.getParam('personId');
      var items = MarketItems.findOne({vendor_key: mKey}) || {};
    //alert('myMarketItems: function() {'+ mKey );
      return items;
    },

  initMarketItems: function(){

  var mKey = FlowRouter.getParam('personId');
  var member = People.findOne({member_key: mKey}) || {};
  //alert("intiial MItem for " + member.fullname + Date());
  var sData = [{vendor_key: mKey, 
              vendorUserId: mKey,
                vendorName: member.fullname,
               vendorEmail: member.email,
            testDataMarket: false,
    items: [   {name:'Market Item', description:'Market Item Description', 
                type:'produce',
          salesAlert:'',
            unitType:'pound',
           unitPrice: 0.99,
            currency:'USD',
        date_entered: Date(),
           productId: Random.id(),
        }]
  }];  
  _.each(sData, function(sItem) { MarketItems.insert(sItem);});
  }

});
