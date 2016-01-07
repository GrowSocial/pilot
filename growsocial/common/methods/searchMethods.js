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
    var towns = ["Davie", "Fort Lauderdale", "Tampa"];

    var addedList = [];
    for (var i = 0; i < 3; i++) {
      var person = {
        searchSamplePerson: true,
        'member_key': Random.id(),
        firstname: Random.choice(first_names),
        lastname: Random.choice(last_names),
        about: "Random test user created for testing search.",
        town: Random.choice(towns),
        latlng: {
          lat: 0.04 * Random.fraction() - 37.82, 
          lng: 0.04 * Random.fraction() + 144.97,
        },
      };
      person.email = person.member_key + "@test.t";
      person.fullname = person.firstname + ' ' + person.lastname;
      addedList.push(person.fullname);
      // console.log('for search, adding sample person:', person);
      People.insert(person);
    }
    // console.log('method, addedList:', addedList);
    return addedList; // passed through client callback
  },
  
  removeSearchSamplePeople: function() {
    People.remove({searchSamplePerson: true});
  },
});