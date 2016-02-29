Meteor.methods({
  
	deleteUpload: function(uploadId) {
    if (Accounts.userId()) {
      if (People.findOne({'member_key': Accounts.userId(), 'photoId': uploadId})) {
        People.update({'member_key': Accounts.userId()}, {$unset: {'photoUrl': "", 'photoId':""}});
      }
      Uploads.remove({_id: uploadId, 'metadata.owner': Accounts.userId()});
    };
  },

	setProfilePic: function(pic) {
    if (Accounts.userId()) {
      People.update({'member_key': Accounts.userId()}, {$set: {'photoUrl': pic.photoUrl, 'photoId':pic.photoId}});
    }
  },
  setProfileCoverPic: function(pic) {
      if (Accounts.userId()) { //console.log("AID found/setting profile cover ",pic); 
      People.update({'member_key': Accounts.userId()},  {$set: {'coverImageUrl': pic.coverImageUrl, 'coverImageId':pic.coverImageId}});
    }
  },

	unsetProfilePic: function() {
    if (Accounts.userId()) {
      People.update({'member_key': Accounts.userId()}, {$unset: {'photoUrl': "", 'photoId':""}});
    }
  },

	setOwnerUpload: function(uploadId) {
    // TODO a bit of a security hole
    if (Accounts.userId()) {
      //console.log("setting owner");
      Uploads.update({_id: uploadId}, {$set: {'metadata.owner': Accounts.userId()}});
    }
  },
  
});
