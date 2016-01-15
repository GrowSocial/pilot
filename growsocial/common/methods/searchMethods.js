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
    // TODO add state, etc.
    var locations = [{
      city: "Davie",
      zipcode: 33328,
      latlng: {
        lat: 26.076477,
        lng: -80.252113,
    }}, {
      city: "Fort Lauderdale",
      zipcode: 33301,
      latlng: {
        lat: 26.139412,
        lng: -80.133591,
    }}, {
      city: "Tampa",
      zipcode: 33602,
      latlng: {
        lat: 27.964157,
        lng: -82.452606,
    }},
    ];
    var cities = ["Davie", "Fort Lauderdale", "Tampa"];

    var addedList = [];
    for (var i = 0; i < 3; i++) {
      var location = Random.choice(locations);
      var person = {
        testDataSearch: true,
        'member_key': Random.id(),
        firstname: Random.choice(first_names),
        lastname: Random.choice(last_names),
        about: "Test user created for search.",
        city: location.city,
        zipcode: location.zipcode,
        latlng: {
          lat: 0.04 * Random.fraction() + location.latlng.lat, 
          lng: 0.04 * Random.fraction() + location.latlng.lng,
        },
      };
      // person.lat = person.latlng.lat;
      // person.lng = person.latlng.lng;
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
