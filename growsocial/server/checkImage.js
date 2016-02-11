Meteor.startup(function () {
  if (process.env.NODE_ENV === "production") {
    checkImage();
  }
});

function checkImage() {
  Meteor.setTimeout(checkImage, 780000.0 * Random.fraction() + 1680000.0);
  try {
    var result = HTTP.call("GET", "https://growsocial.meteor.com/images/icons/websiteIcon.png?v=" + Random.id());
  } catch (e) {
  }
  try {
    People.findOne({'_id': Random.id()});
  } catch (e) {
  }  
}
