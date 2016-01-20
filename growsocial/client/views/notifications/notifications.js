Template.notifications.helpers({
  notifications: function() {
    // relies on the published messages filtering by targetUserId = this userId
    return Notifications.find({}, {sort: {dateTime: -1}});
  },
  notifyCount: function () {
    return Notifications.find().count();
  },
});

Template.notifications.events({
  'click #addSampleNotificationButton': function(event, template) {
    event.preventDefault();
    Meteor.call('addSampleNotification');
  },
  'click #clearMyNotificationsButton': function(event, template) {
    event.preventDefault();
    Meteor.call('clearMyNotifications');
  },
});
