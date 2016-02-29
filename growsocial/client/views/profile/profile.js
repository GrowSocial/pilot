/* UI Helpers


            */


  UI.registerHelper('userIsLoggedOn', function(context, options) {//  console.log(Meteor.userId());
  if (Meteor.userId()){ return true } else { return false;}
  });



  UI.registerHelper('moreMItems2Display', function(context, options) {
      var offset = Session.get('marketItemArrayOFFSET');
      var count = Session.get('MItemCount',count);
      var limit=Session.get('marketItemArrayLIMIT')
      //console.log("offset + count +limit"+offset + count +limit);
      if ((offset+limit) >(count-1))   { return false } else { return true;}

  }); //

  UI.registerHelper('morePicItems2Display', function(context, options) {
      var offset = Session.get('picItemArrayOFFSET');
      var count = Session.get('picItemCount',count);
      var limit=Session.get('marketItemArrayLIMIT')
      //console.log("offset + count +limit"+offset + count +limit);
      if ((offset+limit) >(count-1))   { return false } else { return true;}

  });

  UI.registerHelper('formatTime', function(context, options) {
    if(context)
      return moment(context).format('MM/DD/YYYY, hh:mm');
  });



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


Template.addComment.helpers({
});
Template.addComment.events({

  'submit form': function(){ event.preventDefault();
    var mKey = FlowRouter.getParam('personId');
    var commentTEXT = event.target.comment.value;
    //console.log(commentTEXT);
    Comments.insert({        
                    member_key: mKey,
                     commentBy: Accounts.userId(),
                       comment: commentTEXT,
                     timestamp: Date(),
                     commentSource:"PROFILE PAGE",
                    }
      ,      // console.log(commentTEXT);

    function(error, commentId) {
        //console.log(mKey,Meteor.userId(),commentId);
        if (commentId && mKey != Meteor.userId() ) {
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
  
  //Resoving problem where form from desktop is not reset, ;
  //required for element 0 & 1, per two templates instanced that call this procedure. Clear both 
    $('.add-post-form')[0].reset(); //http://stackoverflow.com/questions/20760368/how-to-reset-a-form-in-meteor
    $('.add-post-form')[1].reset(); //http://stackoverflow.com/questions/20760368/how-to-reset-a-form-in-meteor   
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

}); //on created 'profile'
Template.profile.helpers({

  selectProfile: function() {
      var mKey = FlowRouter.getParam('personId');
      var member = People.findOne({member_key: mKey}) || {};
      return member;
    }
});


Template.profile_DESKTOP.onCreated(function() { 
  var self = this;

  self.autorun(function() 
    { var member_Key = FlowRouter.getParam('personId');
      self.subscribe('oneProfileRec', member_Key); 
    }
  )
}); //on created 'profile'

Template.profile_DESKTOP.events({


  /* these 5 calls (setProfileCoverPic)  can be consolidated by restructuring the event trigger with a 
     child template accepting parameter for item in group currently displayed.
     Hard coded here for the moment.
  */
 'click .setProfileCoverPic0': function () { //
    var offset = Session.get('picItemArrayOFFSET')
    var myItemIds = Session.get('picIdArray');// originated at 'ifThereAreItems()'
    var myItemUrls = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
    var targetItem=offset;
  //console.log(" event finding: ",offset,myItemIds[targetItem]) ;    
  Meteor.call("setProfileCoverPic", {coverImageUrl: myItemUrls[targetItem], coverImageId: myItemIds[targetItem]}  );
  },
 'click .setProfileCoverPic1': function () { //
    var offset = Session.get('picItemArrayOFFSET')
    var myItemIds = Session.get('picIdArray');// originated at 'ifThereAreItems()'
    var myItemUrls = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
    var targetItem=offset+1;
  //console.log(" event finding: ",offset,myItemIds[targetItem]) ;    
  Meteor.call("setProfileCoverPic", {coverImageUrl: myItemUrls[targetItem], coverImageId: myItemIds[targetItem]}  );
  },
 'click .setProfileCoverPic2': function () { //
    var offset = Session.get('picItemArrayOFFSET')
    var myItemIds = Session.get('picIdArray');// originated at 'ifThereAreItems()'
    var myItemUrls = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
    var targetItem=offset+2;
  //console.log(" event finding: ",offset,myItemIds[targetItem]) ;    
  Meteor.call("setProfileCoverPic", {coverImageUrl: myItemUrls[targetItem], coverImageId: myItemIds[targetItem]}  );
  },
 'click .setProfileCoverPic3': function () { //
    var offset = Session.get('picItemArrayOFFSET')
    var myItemIds = Session.get('picIdArray');// originated at 'ifThereAreItems()'
    var myItemUrls = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
    var targetItem=offset+3;
  //console.log(" event finding: ",offset,myItemIds[targetItem]) ;    
  Meteor.call("setProfileCoverPic", {coverImageUrl: myItemUrls[targetItem], coverImageId: myItemIds[targetItem]}  );
  },
 'click .setProfileCoverPic4': function () { //
    var offset = Session.get('picItemArrayOFFSET')
    var myItemIds = Session.get('picIdArray');// originated at 'ifThereAreItems()'
    var myItemUrls = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
    var targetItem=offset+4;
  //console.log(" event finding: ",offset,myItemIds[targetItem]) ;    
  Meteor.call("setProfileCoverPic", {coverImageUrl: myItemUrls[targetItem], coverImageId: myItemIds[targetItem]}  );
  },

 'click .setProfileCoverPic5': function () { //
    var offset = Session.get('picItemArrayOFFSET')
    var myItemIds = Session.get('picIdArray');// originated at 'ifThereAreItems()'
    var myItemUrls = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
    var targetItem=offset+5;
  //console.log(" event finding: ",offset,myItemIds[targetItem]) ;    
  Meteor.call("setProfileCoverPic", {coverImageUrl: myItemUrls[targetItem], coverImageId: myItemIds[targetItem]}  );
  },

  'click .scrollMIAhead': function()
  {   Session.set('marketItemArrayLIMIT',5) //save new scroll box item limit    
    var offset=Session.get('marketItemArrayOFFSET'); //
    var limit=Session.get('marketItemArrayLIMIT')
    var count=Session.get('MItemCount'); //console.log(count + "~" + offset);
    offset=offset+1;
    if ( (offset>(count-limit) ) )  {  return false;  } 
    else { Session.set('marketItemArrayOFFSET',(offset)); return true;  } 
  }, 
  'click .scrollMIReverse': function()
  { //  event.preventDefault();
    var offset=Session.get('marketItemArrayOFFSET'); 
    var count=Session.get('MItemCount'); 
    offset=offset-1;
    if ( (offset<0) )  {  return false; } 
    else {  Session.set('marketItemArrayOFFSET',(offset)); return true;  }
  }, //function

  'click .scrollPicsAhead': function()
  {       
    var offset=Session.get('picItemArrayOFFSET'); //
    var limit=Session.get('picItemArrayLIMIT')
    var count=Session.get('picItemCount'); //console.log(count + "~" + offset);
    offset=offset+1;
    if ( (offset>(count-limit) ) ) 
      {  //console.log(count + "~else~" + offset);
      return false;
      } 
    else {   //console.log(count + " ct inc off" + offset); 
      Session.set('picItemArrayOFFSET',(offset)); //store new
      return true; 
    } 
  }, //function
  'click .scrollPicsReverse': function()
  {     //  event.preventDefault();
    var offset=Session.get('picItemArrayOFFSET'); //
    var count=Session.get('picItemCount');   //console.log(count + "~" + offset);
    offset=offset-1;
    if ( (offset<0) ) 
      {  return false;
      } 
    else { //console.log(count + " ct inc off" + offset); 
      Session.set('picItemArrayOFFSET',(offset)); //store new
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

  uploads: function() {
    // only manage my own uploads
    return Uploads.find({'metadata.owner': Meteor.userId()}, {sort: {uploadedAt: -1}});
  },

  pathForStore: function(productId) {
    var mKey = FlowRouter.getParam('personId');
    var path = FlowRouter.path("store", {}, {'v': mKey, 'p': productId});
    return path;
  },
  pathForMarketItem: function(productId) {
    var mKey = FlowRouter.getParam('personId');
    var path = FlowRouter.path("store", {}, {'v': mKey, 'p': productId});
    return path;
  },

 
  there_are_items: function(caller){
    /*
    to assess documents are present in respective collections.
    If present, 
    and app design now includes functional use of collection,
    use to instance session requirements as data image or properties based on appraisal of the collection.
    */

      var mKey = FlowRouter.getParam('personId');
      switch (caller)
      {

        case 'graphicUploads': //
          var thisDocSet =Uploads.find({'metadata.owner': Meteor.userId(),  
                                        $or: [{'original.type': 'image/jpeg'}, {'original.type': 'image/png'}],   
          },
          {sort: {uploadedAt: -1}}
          ).fetch();
          var count = thisDocSet.length; // know how many items are there

          //console.log("data image ",thisDocSet);  //entire fetch~
          //console.log("records to array: ",count) 
          //console.log("0data image ",thisDocSet[0]);  
          //console.log("0data image ",thisDocSet[1]);
          //console.log("0 _id ",thisDocSet[0]._id);
          //console.log("0 url() ",thisDocSet[0].url());  
          //console.log("0 type ",thisDocSet[0].original.type);
          //console.log("0 name ",thisDocSet[0].original.name);

          var myUrls = []; 
          var myIds = [];
          for (var i = 0; i < count; i++) { myUrls.push(thisDocSet[i].url());  myIds.push(thisDocSet[i]._id);     
          }

          Session.set('picUrlArray',myUrls);// save for navigation client  
          Session.set('picIdArray',myIds);// save for navigation client
          Session.set('picItemArrayOFFSET',0) //begin at first item
          Session.set('picItemCount',count);// save for navigation client
         break;

        case 'marketItems': 
          /*var count= MarketItems.find({vendor_key: mKey}).count(); sould only be one per member
              Eventually can be more than one, see notes from TEC following original design release, Dec.2015
          */   
          var MItemDoc = MarketItems.findOne({vendor_key: mKey}) || {};
          var objArray = $.makeArray( MItemDoc.items ); //grab the necesary sub-document as local object
          var count=objArray.length // know how many items are there
          Session.set('MItemCount',count);// save for navigation client

          Session.set('marketItemArray',objArray);// save for navigation client           
          Session.set('marketItemArrayOFFSET',0) //begin at first item 
          break;


        case 'connections': var count= Connections.find({member_key: mKey}).count();
          break;
        case 'pictures': var count= Member_Pictures.find({member_key: mKey}).count();
          break;
        case 'videos': var count= Member_Videos.find({member_key: mKey}).count(); 
          break;
        case 'blogEntries': var count=0;
        case 'calendarEvents': var count=0;
        case 'memberContacts': var count=0;    

        default: var count=0;
      }  
      if (count) { return true } else { return false;}
    },

  displayMIFromOffset: function(){ var offset = Session.get('marketItemArrayOFFSET');
    if (offset) { return true } else { return false;}
  },
 


  displayPicFromOffset: function(){ var offset = Session.get('picItemArrayOFFSET');
    if (offset) { return true } else { return false;}
  },

  boxItems: [0,1,2,3,4 ], //for selectMarketItems scroll box
  selectMarketItems: function(displayOrdinal) {
    //get [indice] item from the items array
    //
    //every call repeats refresh from collection,  reactive
      var myItems = Session.get('marketItemArray');// save for navigation client
      var offset = Session.get('marketItemArrayOFFSET')
      var totalCount = myItems.length;// Session.get('MItemCount');// save for navigation client
      var nextItem = offset + displayOrdinal
      if ( nextItem > totalCount) { return "" }  
      else {   return myItems[nextItem]; } 
      /*
            //another approach , if only a portion of sub-doc is needed 
            // ::~  return {q: iArray[0].q, a1: iArray[0].a1 }
      */
    },

  selectPictureItems: function(displayOrdinal) {
      var offset = Session.get('picItemArrayOFFSET')
      var myItemUrl = Session.get('picUrlArray');// originated at 'ifThereAreItems()'
      var nextItem = offset + displayOrdinal
      var totalCount = myItemUrl.length;
      var nextItem = offset + displayOrdinal;
      if ( nextItem > totalCount) { return "" }  
        else {  return myItemUrl[nextItem]; } 
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
    //  alert("in myProfile test "+Accounts.userId());
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

  pathForStore: function(productId) {
    var mKey = FlowRouter.getParam('personId');
    var path = FlowRouter.path("store", {}, {'v': mKey, 'p': productId});
    return path;
  },
    pathForMarketItem: function(productId) {
    var mKey = FlowRouter.getParam('personId');
    var path = FlowRouter.path("store", {}, {'v': mKey, 'p': productId});
    return path;
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

  selectPictureItems: function(displayOrdinal) {
    //alert(displayOrdinal);
      var offset = Session.get('pictureItemArrayOFFSET')
      var totalCount = Session.get('PItemCount');// save for navigation client
      var nextItem = offset + picdisplayOrdinal
       //alert("next" +  nextItem);
      if ( nextItem > totalCount) { return "" }  
        else { 
            var myItems = Session.get('picItemArray');// save for navigation client
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
