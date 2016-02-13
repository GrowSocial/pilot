Template.registerHelper('roundToCents', function(value) {
  if(value) return Math.round(value * 100) /100;
});

Template.registerHelper('profilePicUrl', function(member_key) {
  var person = null;
  if (!member_key) member_key = Meteor.userId();
  if (member_key)  {
    person = People.findOne({'member_key': member_key, 'photoUrl': {$exists: true}}, {fields: {photoUrl: 1}});
  }
  if (person) {
    return person.photoUrl;
  } else {
    return "/images/user-images/noAvatar2.jpg";   // profile-jane.jpg  noAvatar.png
  }
});

Template.registerHelper('shorten', function(theString, length) {
  if (theString) {
    return theString.substring(0, length);
  } else {
    return "";
  }
});
