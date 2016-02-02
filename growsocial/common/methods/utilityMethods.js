Meteor.methods({

  getEnv: function() {
    if (Meteor.isServer) {
      return {"NODE_ENV": process.env.NODE_ENV, "ROOT_URL": process.env.ROOT_URL}; // "production" / other
    }
  },
});
