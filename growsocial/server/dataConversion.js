Meteor.startup(function() {
  // convert notification fields
  if (Notifications.findOne(
      { $or: [
        {'header': {$exists: true}}, 
        {'fromUserFirstName': {$exists: true}}, 
        {'fromUserLastName': {$exists: true}},
        {'fromUserId': {$exists: true}},
      ]})
  ) {
    console.log('notifications: renaming "header" to "subject", "fromUserFirstName" to "sender", "fromUserLastName" to "senderLastName", "fromUserId" to "senderUserId"');
    Notifications.update(
      {$or: [
        {'header': {$exists: true}}, 
        {'fromUserFirstName': {$exists: true}}, 
        {'fromUserLastName': {$exists: true}},
        {'fromUserId': {$exists: true}},
      ]}, 
      {$rename: {
        'header': 'subject', 
        'fromUserFirstName': 'sender', 
        'fromUserLastName': 'senderLastName',
        'fromUserId': 'senderUserId',
      }}, 
      {multi: true});
  }

  // add html:true for system messages
  if (Notifications.findOne(
  {
    'tag': 'System', 
    'html': {$exists: false},
  })) {
    console.log('notifications: adding "html:true" to "System" records');
    Notifications.update(
    {
      'tag': 'System', 
      'html': {$exists: false},
    }, {
      $set: { 'html': true },
    }, {
      multi: true
    });
  }
});
