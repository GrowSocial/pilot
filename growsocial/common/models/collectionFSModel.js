UploadsStore = new FS.Store.GridFS("uploads");

Uploads = new FS.Collection("uploads", {
  filter: {
    maxSize: 5000000, //bytes  5MB approx
    // allow: {
      // contentTypes: ['image/*'],
      // extensions: ['png', 'jpg'],
    // },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        // TODO improve this!
        alert(message);
      } else {
        console.log(message);
      }
    }
  },
  stores: [UploadsStore],
});
