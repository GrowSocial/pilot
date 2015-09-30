Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) { 

  Template.body.helpers({

    tasks: function () {
      if (Session.get("hide-selected")) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}}); // If hide-selected is checked, filter tasks
      } else 
        { return Tasks.find({}, {sort: {createdAt: -1}}); } // Otherwise, return all of the items
    },
    hideSelected: function () {  return Session.get("hide-selected"); },

    unselectedCount: function () { return Tasks.find({checked: {$ne: true}}).count(); },

  }) //end Template.body.helpers


  Template.body.events({
    "submit .new-task": function (event) {   event.preventDefault(); // Prevent default browser form submit
      var text = event.target.text.value;// Get value from form element

      Tasks.insert({ text: text, createdAt: new Date(),
              owner: Meteor.userId(), // _id of logged in user
              username: Meteor.user().username

         }); // end Insert an item into the collection
      
      event.target.text.value = "";// Clear form
    },

    "change .hide-selected input": function (event) { Session.set("hide-selected", event.target.checked); }

  });//Template.body.events
  

  Template.task.events({
    "click .toggle-checked": function () {  Tasks.update(this._id, { $set: {checked: ! this.checked}  });   },
    "click .delete": function () {   Tasks.remove(this._id);   }
  }); //end Template.task.events

  Accounts.ui.config({ passwordSignupFields: "USERNAME_ONLY" });

} //end (Meteor.isClient)
