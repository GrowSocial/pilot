Template.uploads.onCreated(function() {
  // TODO replace the onInvalid function with something useful to UI
  // console.log('onCreated, Uploads.options.filter', Uploads.options.filter);
});

Template.uploads.onRendered(function() {
  // TODO replace the onInvalid function with something useful to UI
  // is there an API for this, or do we just set Uploads.options.filter.onInvalid = function(message) {}
  // console.log('onRendered, Uploads.options.filter', Uploads.options.filter);
  // console.log('onRendered, Uploads', Uploads);
});

Template.uploads.helpers({
  uploads: function() {
    // only manage my own uploads
    return Uploads.find({'metadata.owner': Meteor.userId()}, {sort: {uploadedAt: -1}});
  },
  
  uploadCount: function () {
    return Uploads.find({'metadata.owner': Meteor.userId()}).count();
  },


});


  
Template.uploadItem.helpers({
  thumbnail: function(upload) {
    if (upload.isImage()) {
      return upload.url();
    } else {
      return "/images/icons/pclip.png";
    }
  },

  pathForProfile: function() {
    var params = { personId: Meteor.userId() };
    var path = FlowRouter.path("profile", params);
    return path;
  },


});

Template.uploads.events({
  
  'change #inputFileUpload': function(event, template) {
    var owner = Meteor.userId();
    FS.Utility.eachFile(event, function(file) {
      Uploads.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if (err) {
          console.log('error ... ', err);
        } else {
          // console.log('Upload result: ', fileObj);
          // console.log('Upload result: url ', fileObj.url());
          // console.log('Upload result: isImage? ', fileObj.isImage());
          // console.log('Upload result: size', fileObj.size());
          
          // set the owner to me  // TODO security hole, should do this on the server
          // fileObj.update({$set: {'metadata.owner': Meteor.userId()}});  // TODO security hole
          Meteor.call("setOwnerUpload", fileObj._id);
          
          // TODO can I do this on the server? 
          // https://github.com/CollectionFS/Meteor-CollectionFS/wiki/Event-Listeners-for-different-stages-of-file-insert-upload

          // aldeed says it's a bad idea to insert the FS.File instance into a normal collection
          // instead store the id of the fileObj
          // https://github.com/CollectionFS/Meteor-CollectionFS/issues/286#issuecomment-42777431
          
          // here it causes: 
          // Exception in delivering result of invoking '/cfs.images.filerecord/insert': RangeError: Maximum call stack size exceeded
          
          // fix for this is to  Installing the cfs-ejson-file package
        }
      });
    });
  },

  "click .delete": function () {
    Meteor.call("deleteUpload", this.upload._id);
  },
  
  "click .setProfile": function () {
    //console.log("event helper SP ",this.upload._id)
    Meteor.call("setProfilePic", {photoUrl: this.upload.url(), photoId: this.upload._id});
  },
  
  "click .setProfileCover": function () {
    //console.log("event helper SPCPic ",this.upload._id)
    Meteor.call("setProfileCoverPic", {coverImageUrl: this.upload.url(), coverImageId: this.upload._id});
  },
  "click .unsetProfile": function () {
    Meteor.call("unsetProfilePic");
  },
});
