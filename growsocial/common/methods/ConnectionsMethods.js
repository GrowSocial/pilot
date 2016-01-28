Meteor.methods({

inviteConnect:function(viewedMembr,loggedInMembr){
/*

 Schemas.connectRec = new SimpleSchema({
         member_key:{type: String,index: 1,optional: false },
            contact:{type: String, optional:false},
          timestamp:{type: Date, optional:false },
           descript:{type: String, optional:false },
});
*/

/* Document already exist if viewdMembr has other connections
   1)find out if we are creating the document or pushing a new array rec
*/
var count = Connections.find({member_key: loggedInMembr, contact: viewedMembr}).count();

if (count) 
{
//alert("exisiting rec btwn " + loggedInMembr + " and " + viewedMembr);
/*
    Connections.update(
    	{  member_key: viewedMembr }, 
    	{ $push: {"contact.member_id":loggedInMembr,  "contact.timestamp":Date(), "contact.descript":'invitation' }  }        
     	);
*/
//Polls.update({ _id: id },{      $push: { already_voted: ip }     })

/*Connections.update({
    query: {  member_key: viewedMembr },
    sort: { member_key: 1 },
    update: { $push: {"contact.member_id":loggedInMembr,  "contact.timestamp":Date(), "contact.descript":'invitation' }  },
    upsert: true
})*/



/*
   Connections.update( { member_key: viewedMembr },
   {
     $push: {
       contact: { $each: [ { "member_id":loggedInMembr }, { "timestamp":Date() }, { "descript":'invitation'} ],  }
     }
   }
	);
  */

} 
else 
{

   var sData = [
    { member_key: loggedInMembr, 
         contact: viewedMembr,  
         timestamp:Date(), 
         descript:'invitation'   }
    ];
  _.each(sData, function(sItem)  { Connections.insert(sItem); }     );

}


},

acceptConnect:function(viewedMembr,loggedInMembr){

/*
Connections.update( //test , just update tiemstamp
    {  "member_key": viewedMembr,"contact.member_id":loggedInMembr},
    {
        "$set": {'contact.$.timestamp': Date(), 'contact.descript':'connected' }
    }
)
*/
}


});
