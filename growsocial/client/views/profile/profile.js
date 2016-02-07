/* UI Helpers


 last upload merged to master: #152 Feb 2016
            next edit due to push: post 153

            */


  UI.registerHelper('userIsLoggedOn', function(context, options) {
  if (Meteor.userId()){ return true } else { return false;}

  });



  UI.registerHelper('moreItems2Display', function(context, options) {
      var offset = Session.get('marketItemArrayOFFSET');
      var count = Session.get('MItemCount',count);
      var limit=Session.get('marketItemArrayLIMIT')
      //console.log("offset + count +limit"+offset + count +limit);
      if ((offset+limit) >(count-1))   { return false } else { return true;}

  });


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


  UI.registerHelper('MItemIndice', function(current, options) {
    var  zeta = Session.get('MItemCount');// latest pointer
    var  indice = Session.get('MItemIndice');// latest pointer
    
    indice +=1;
    Session.set('MItemIndice', indice);
    //alert(current + " roomInBox readiing limit as "+ limit);
    if (current < limit) { return true } else { return false;}
  });




  UI.registerHelper('formatTime', function(context, options) {
    if(context)
      return moment(context).format('MM/DD/YYYY');
  });

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
    Comments.insert({        
      member_key: mKey,
       commentBy: Accounts.userId(),
         comment: commentTEXT,
       timestamp: Date(),
       commentSource:"PROFILE PAGE",
      },      // console.log(commentTEXT);

    function(error, commentId) {
        console.log("commentId",commentId);
        if (commentId) {
          var commentNotification = {
            targetUserId: mKey,
            tag: "Comment",
            subject: "Comment made on your profile page",
            message: commentTEXT,
          };
          if (Meteor.userId()) {
            commentNotification.senderUserId = Meteor.userId();
            commentNotification.sender = Meteor.user().profile.firstname;
            commentNotification.senderLastName = Meteor.user().profile.lastname;
            commentNotification.imageUrl = "/images/user-images/profile-mary.jpg"; // TODO profile image of logged-in user
          } else {
            commentNotification.sender = "Guest";
          }
          Meteor.call("addNotification", commentNotification);
      }

    });
    $('.add-post-form')[0].reset(); //http://stackoverflow.com/questions/20760368/how-to-reset-a-form-in-meteor
  }
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
    Or, design the app always resumes from the main emenu, which today it does not.

    OR: from a systems design standpoint we turn to another approach altogether for being certain admin, 'psuedo_0' is present in database

    */


    if (AdminInitialized == 0) { 
    // Will be TRUE if People has not been loaded until now
    // irregardless of admin record present.
    // Can happen if the app restarts from the profile page and will cause a record insert exception.
    // No error handling is coded here, for now. 
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

  selectProfile: function() {
      var mKey = FlowRouter.getParam('personId');
      var member = People.findOne({member_key: mKey}) || {};
      return member;
    }
});




// for now, replicating profile onCreated & helpers to impliment mobile/desktop verion; 
//  Eventually, we should consolidate this and not repeat the functions in librbary
//

Template.profile_DESKTOP.onCreated(function() { 
  var self = this;

  self.autorun(function() 
    { var member_Key = FlowRouter.getParam('personId');
      self.subscribe('oneProfileRec', member_Key); 
    }
  )
}); //on created 'profile'

Template.profile_DESKTOP.events({
  'click .scrollBoxAhead': function()
  {   Session.set('marketItemArrayLIMIT',5) //save new scroll box item limit    
    var offset=Session.get('marketItemArrayOFFSET'); //
    var limit=Session.get('marketItemArrayLIMIT')
    var count=Session.get('MItemCount'); //console.log(count + "~" + offset);
    offset=offset+1;
    if ( (offset>(count-limit) ) ) 
      {  //console.log(count + "~else~" + offset);
      return false;
      } 
    else {   //console.log(count + " ct inc off" + offset); 
      Session.set('marketItemArrayOFFSET',(offset)); //store new
      return true; 
    } 
  }, //function

  'click .scrollBoxReverse': function()
  {     //  event.preventDefault();
    var offset=Session.get('marketItemArrayOFFSET'); //
    var count=Session.get('MItemCount');   //console.log(count + "~" + offset);
    offset=offset-1;
    if ( (offset<0) ) 
      {  //console.log(count + "~else~" + offset);
      return false;
      } 
    else { //console.log(count + " ct inc off" + offset); 
      Session.set('marketItemArrayOFFSET',(offset)); //store new
      return true; 
    }
  }, //function


  'click .connectSelect': function()
  {     //  event.preventDefault();

    var viewedMembr = FlowRouter.getParam('personId');//alert("initial MItem for " + member.fullname + Date());
    var loggedInMembr = Accounts.userId()//
    //console.log("quer InvConnect as : viewedM " + viewedMembr + " : LoggedM"  + loggedInMembr)
    if (viewedMembr == loggedInMembr) //would indicate  MEMBER VIEWING THEIR OWN PROFILE
      { //display all connections & pending invites

       return; 
      }
    Meteor.call('inviteConnect',viewedMembr,loggedInMembr)  //successful invite

  } //function


});  //template

Template.profile_DESKTOP.helpers({

  boxItems: [0,1,2,3,4 ],

  pathForMarketplace: function() {
    var path = FlowRouter.path("marketplace");//console.log(path);
    return path;
  },
  
  there_are_items: function(caller){
    /*
    to assess documents are present in respective collections.
    If present, 
    and app design now includes functional use of collection,
    use to instance session requirements as data image or properties based on appraisal of the collection.
    Feb 2016: see marketItems, below

    */

      var mKey = FlowRouter.getParam('personId');
      switch (caller)
      {
        case 'pictures': var count= Member_Pictures.find({member_key: mKey}).count();
          break;
        case 'videos': var count= Member_Videos.find({member_key: mKey}).count(); 
          break;
        case 'marketItems': 
        /*var count= MarketItems.find({vendor_key: mKey}).count(); sould only be one per member
            Eventually can be more than one, see notes from TEC following original design release, Dec.2015
        */
        
          /* DOESN'T WORK      (see passing comments online about mixing 0& 1's)
            var items = MarketItems.findOne({vendor_key: mKey},{          vendor_key:0,
              vendorUserId:0,
              vendorBusinessId: 0,
              vendorLink: 0,
              vendorName: 0,
              vendorEmail: 0,
              testDataMarket:0,
                      items:1});
            */
          var MItemDoc = MarketItems.findOne({vendor_key: mKey}) || {};
          var objArray = $.makeArray( MItemDoc.items ); //grab the necesary sub-document as local object
          var count=objArray.length // know how many items are there
          Session.set('MItemCount',count);// save for navigation client

           /*in future need to manipulte, translate for profile client
                  
                    for(i = 0; i < count; i++){
                      var me= objArray[i].description;
                      if (me.length > 16) objArray[i].description="noodles" //me.substr(0,16);
                      var me= objArray[i].name;
                      if (me.length > 16) objArray[i].name="noodles" //me.substr(0,16);
                      //console.log(me);       
                    }
            */
          Session.set('marketItemArray',objArray);// save for navigation client           
          Session.set('marketItemArrayOFFSET',0) //begin at first item
          //console.log(count + " in Load of MarketItems");
          //console.log(objArray); 
          break;
        case 'connections': var count= Connections.find({member_key: mKey}).count();
          break;
        case 'blogEntries': var count=0;
        case 'calendarEvents': var count=0;
        case 'memberContacts': var count=0;      
        default: var count=0;
      }  
      if (count) { return true } else { return false;}
    },

  displayFromOffset: function(){ var offset = Session.get('marketItemArrayOFFSET');
    if (offset) { return true } else { return false;}
  },


  selectMarketItems: function(displayOrdinal) {

    //get [indice] item from the items array
    //
    //every call repeats refresh from collection,  reactive

      var offset = Session.get('marketItemArrayOFFSET')
      var totalCount = Session.get('MItemCount');// save for navigation client
      var nextItem = offset + displayOrdinal
       //     console.log("offset " + offset );
       //     console.log("tot " + totalCount);
       //     console.log("next" +  nextItem);
      if ( nextItem > totalCount) { return "" }  
      else { var myItems = Session.get('marketItemArray');// save for navigation client 
             return myItems[nextItem];
          } 

      /*
            Session.set('MItemCount',zeta);// save for session navigation client

            //console.log(L);
            console.log(zeta);
            console.log(objArray); // to the first line of your helper.
            return objArray
            //another approach , if only a portion of sub-doc is needed 
            // ::~  return {q: iArray[0].q, a1: iArray[0].a1 }
      */
    },


  connectionInvoked: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var count = Connections.find({member_key: loggedInMembr, contact:viewedMembr}).count();
    //alert("connectionInvoked " + count);
    return count;
  },

  connectionPending: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var pending = Connections.find({member_key: loggedInMembr, contact:viewedMembr, descript: 'invitation'}).count();
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
}); //on created 

Template.profile_MOB.events({
  'click .scrollBoxAhead': function()
  {          Session.set('marketItemArrayLIMIT',3) //save new scroll box item limit    
    var offset=Session.get('marketItemArrayOFFSET'); //
    var limit=Session.get('marketItemArrayLIMIT')
    var count=Session.get('MItemCount'); //console.log(count + "~" + offset);
    offset=offset+1;
    if ( (offset>(count-limit) ) ) 
      {  //console.log(count + "~else~" + offset);
      return false;
      } 
    else {   //console.log(count + " ct inc off" + offset); 
      Session.set('marketItemArrayOFFSET',(offset)); //store new
      return true; 
    } 
  }, //function

  'click .scrollBoxReverse': function()
  {     //  event.preventDefault();
    var offset=Session.get('marketItemArrayOFFSET'); //
    var count=Session.get('MItemCount');   //console.log(count + "~" + offset);
    offset=offset-1;
    if ( (offset<0) ) 
      {  //console.log(count + "~else~" + offset);
      return false;
      } 
    else { //console.log(count + " ct inc off" + offset); 
      Session.set('marketItemArrayOFFSET',(offset)); //store new
      return true; 
    }
  }, //function
  'click .connectSelect': function(){
   //   console.log("clicked CONNECT button");

    var viewedMembr = FlowRouter.getParam('personId');//alert("initial MItem for " + member.fullname + Date());
    var loggedInMembr = Accounts.userId()//
    //console.log("quer InvConnect as : viewedM " + viewedMembr + " : LoggedM"  + loggedInMembr)
    if (viewedMembr == loggedInMembr) //would indicate  MEMBER VIEWING THEIR OWN PROFILE
      { //display all connections & pending invites

       return; 
      }
    Meteor.call('inviteConnect',viewedMembr,loggedInMembr)  //successful invite



    }
});

Template.profile_MOB.helpers({

  boxItems: [0,1,2  ],


  pathForMarketplace: function() { var path = FlowRouter.path("marketplace"); 
    return path;//console.log(path);
  },
  
  there_are_items: function(caller){ var mKey = FlowRouter.getParam('personId');
    switch (caller)
    {
      case 'pictures': var count= Member_Pictures.find({member_key: mKey}).count();
        break;
      case 'videos': var count= Member_Videos.find({member_key: mKey}).count(); 
        break;
      case 'marketItems': //var count= MarketItems.find({vendor_key: mKey}).count(); sould only be one per member
        var MItemDoc = MarketItems.findOne({vendor_key: mKey}) || {};
        var objArray = $.makeArray( MItemDoc.items ); //grab the necesary sub-document as local object
        var count=objArray.length // know how many items are there
        Session.set('MItemCount',count);// save for navigation client
        Session.set('marketItemArray',objArray);// save for navigation client
        Session.set('marketItemArrayOFFSET',0) //begin at first item
        //Session.set('marketItemArrayLIMIT',3) //save new scroll box item limit         
        //console.log(count + " in Load of Mobile");
        //console.log(objArray); // to the first line of your helper.
        break;
      case 'connections': var count= Connections.find({member_key: mKey}).count();
        break;
      case 'blogEntries': var count=0;
      case 'calendarEvents': var count=0;
      case 'memberContacts': var count=0;      
      default: var count=0;
    }  
    if (count) { return true } else { return false;}
  },
  displayFromOffset: function(){
    var offset = Session.get('marketItemArrayOFFSET');
    if (offset) { return true } else { return false;}

  },

  selectMarketItems: function(displayOrdinal) {
    //alert(displayOrdinal);
      var offset = Session.get('marketItemArrayOFFSET')
      var totalCount = Session.get('MItemCount');// save for navigation client
      var nextItem = offset + displayOrdinal
       //alert("next" +  nextItem);
      if ( nextItem > totalCount) { return "" }  
        else { 
            var myItems = Session.get('marketItemArray');// save for navigation client
      //console.log(myItems);
            return myItems[nextItem];
          } 
  },

  connectionInvoked: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var count = Connections.find({member_key: loggedInMembr, contact:viewedMembr}).count();
    //alert("connectionInvoked " + count);
    return count;
  },

  connectionPending: function(){
    var viewedMembr = FlowRouter.getParam('personId');
    var loggedInMembr = Accounts.userId()
    var pending = Connections.find({member_key: loggedInMembr, contact:viewedMembr, descript: 'invitation'}).count();
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
