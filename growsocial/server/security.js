// TODO Can remove these permissions when
//      replaced all database actions on the client with method calls
MarketItems.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});
Member_Videos.allow({
  insert: function () { return true;}, 
  update: function () { return true;}, 
  remove: function () { return true;}
});
Member_Pictures.allow({
  insert: function () { return true;},
  update: function () { return true;}, 
  remove: function () { return true;}
});

Member_Reviews.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});
People.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

ArchivedOrders.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

ShoppingCart.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

ContactUsMessages.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

Comments.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

Connections.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

Notifications.allow({
  insert: function () { return true;},
  update: function () { return true;},
  remove: function () { return true;}
});

Uploads.allow({
  insert: function () { // TODO only logged-in users can insert
    return true;
    // if (Accounts.userId()) {  // TODO cannot user Accounts.userId() here
      // return true;
    // } else {
      // return false;
    // }
  },
  update: function () { return true;}, // TODO need to match the owner of the upload
  remove: function () { return true;}, // TODO need to match the owner of the upload
  download: function () { return true;},
});
