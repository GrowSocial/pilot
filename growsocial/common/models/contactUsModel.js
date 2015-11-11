ContactUsMessages = new Mongo.Collection('contactUsMessages');

ContactUsMessages.helpers({
  author: function() {
    return Meteor.users.findOne(this.authorId);
  },
  hasAuthor: function() {
    if (this.authorId) {
      return true;
    } else {
      return false;
    };
  },
});

/* 
 */
/* 
 */
 
/* 
// Feedback model
Feedback = function(doc) {
  _.extend(this, doc);
};

_.extend(Feedback.prototype, {
  // returns a user document for this feedback's author
  fetchAuthor: function() {
    return Meteor.users.findOne(this.authorId);
  },

  // returns true if this feedback has an author
  hasAuthor: function() {
    return this.fetchAuthor().count() > 0;
  },
});

// Feedbacks collection
Feedbacks = new Mongo.Collection("feedbacks", {
  transform: function(doc) {
    return new Feedback(doc);
  }
});

_.extend(Feedbacks, {
  // returns a feedbacks cursor for all feedbacks without a parentId
  findRoots: function(options) {
    return Feedbacks.find({parentId: {$exists: false}}, options);
  }
});
 */