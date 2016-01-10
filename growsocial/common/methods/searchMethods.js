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
    var cities = ["Davie", "Fort Lauderdale", "Tampa"];

    var addedList = [];
    for (var i = 0; i < 3; i++) {
      var person = {
        testDataSearch: true,
        'member_key': Random.id(),
        firstname: Random.choice(first_names),
        lastname: Random.choice(last_names),
        about: "Test user created for search.",
        city: Random.choice(cities),
        latlng: {
          lat: 0.04 * Random.fraction() - 37.82, 
          lng: 0.04 * Random.fraction() + 144.97,
        },
      };
      person.lat = person.latlng.lat;
      person.lng = person.latlng.lng;
      person.email = person.member_key + "@test.t";
      person.fullname = person.firstname + ' ' + person.lastname;
      addedList.push(person.fullname + ', ' + person.city);
      // console.log('for search, adding sample person:', person);
      People.insert(person);
    }
    // console.log('method, addedList:', addedList);
    return addedList; // passed through client callback
  },
  
  removeSearchSamplePeople: function() {
    People.remove({testDataSearch: true});
  },
});
