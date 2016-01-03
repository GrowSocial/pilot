Meteor.methods({

  addSearchSamplePeople: function() {

    var first_names = [
      "Ada",
      "Grace",
      "Marie",
      "Carl",
      "Nikola",
      "Claude",
      "Peter",
      "Stefan",
      "Stephen",
      "Lisa",
      "Christian",
      "Barack"
    ];
    var last_names = [
      "Lovelace",
      "Hopper",
      "Curie",
      "Tesla",
      "Shannon",
      "Muller",
      "Meier",
      "Miller",
      "Gaga",
      "Franklin"
    ];
    var locations = ["Davie", "Fort Lauderdale", "Tampa"];

    var addedList = [];
    for (var i = 0; i < 3; i++) {
      var person = {
        'member_key': Random.id(),
        firstname: Random.choice(first_names),
        lastname: Random.choice(last_names),
        about: "Random test user created for testing search.",
        location: Random.choice(locations),
      };
      person.email = person.member_key + "@sample.com";
      person.fullname = person.firstname + ' ' + person.lastname;
      addedList.push(person.fullname);
      console.log('for search, adding sample person:', person);
      People.insert(person);
    }
    // console.log('method, addedList:', addedList);
    return addedList; // passed through client callback
  },
});
