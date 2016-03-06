Meteor.startup(function () {
  if (process.env.NODE_ENV === "production") {
    Meteor.setTimeout(dailyReport, 5000);
  } else {
    // Meteor.setTimeout(dailyReport, 1000);
  }
});

// TODO schedule for the same time each day
// TODO keep track of _id of most recent one sent, and send from there
function dailyReport() {
  Meteor.setTimeout(dailyReport, 86400000);
  console.log('Daily error report, checking for errors.');

  try {
    var text = "";
    // filter by dateTime > now - 24hrs
    var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    // TODO format fields into useful report
    ErrorLogs.find({'dateTime': {$gte: yesterday}}, {sort: {dateTime: -1}}).forEach(function(log) {
      text = text + "datetime: " + moment(log.dateTime).format('YYYY-MM-DD, HH:mm:ss ZZ') + "\n";
      text = text + EJSON.stringify(log) + "\n\n";
    });
    if (text) {
      console.log('Daily error report, sending to growsocial email.');
      var email = {
        to: "GrowSocial Pilot Coordinator <growsocial.org@gmail.com>",
        from: "GrowSocial Pilot Website <growsocial.org@gmail.com>",
        subject: "GrowSocial daily error report",
        text: "host: " + process.env.ROOT_URL + "\ncollection: ErrorLogs\n\n" + text,
      };
      // no need to do anything with email errors here, so pass empty callback
      Meteor.call('sendEmail', email, function() {});
    } else {
      console.log('Daily error report, no recent errors to send.');
    }
  } catch(e) {
    console.log(e);
  }
}
