// TODO could use similar method to backup all data, if small enough
//  but make into an email attachment instead of inline
Meteor.startup(function () {
  if (process.env.NODE_ENV === "production") {
    Meteor.setTimeout(dailyReport, 5000);
  } else {
    // Meteor.setTimeout(dailyReport, 1000);
  }
});

// TODO schedule for the same time each day
function dailyReport() {
  Meteor.setTimeout(dailyReport, 86400000);
  console.log('Daily error report, sending to growsocial email.');

  try {
    var text = "collection: ErrorLogs\n\n";
    // TODO keep track of _id of most recent one sent, and send from there
    // TODO format fields into something useful
    ErrorLogs.find({}, {sort: {dateTime: -1}}).forEach(function(log) {
      text = text + "datetime: " + moment(log.dateTime).format('YYYY-MM-DD, HH:mm:ss ZZ') + "\n";
      text = text + EJSON.stringify(log) + "\n\n";
    });
    var email = {
      to: "GrowSocial Pilot Coordinator <growsocial.org@gmail.com>",
      from: "GrowSocial Pilot Website <growsocial.org@gmail.com>",
      subject: "GrowSocial daily error report",
      text: text,
    };
    // no need to do anything with email errors here, so pass empty callback
    Meteor.call('sendEmail', email, function() {});
  } catch(e) {
    console.log(e);
  }
}
