


Session.setDefault("autoSaveMode", false);

Template.dbAdmin.helpers({
  pathForProfile: function() {
    var person = this;
    var params = {
      personId: person.member_key //personId: person.personId
    };
    var path = FlowRouter.path("dbAdminEDITOR", params);
//alert("pfp " + person );
    return path;
  },




  people: function () { //alert("" + People.find().count() )
    return People.find();
  },

  selectedPersonDoc: function () {
    return People.findOne(Session.get("selectedPersonId"));
  },
  isSelectedPerson: function () { //alert("isSelectedPerson:"+ this._id);
    return Session.equals("selectedPersonId", this._id);
  }

});



Template.dbAdmin.events({
  'click .person-row': function () {
    Session.set("selectedPersonId", this._id);
    //alert("on click " + this._id );
  }

});



Template.dbAdminEDITOR.onCreated(function() { var self = this;
  self.autorun(function() { var member_Key = "any";
  self.subscribe('oneProfileRec', member_Key); 
  //alert('Template.profile.onCreated('+ member_Key); 
  });
})

Template.dbAdminEDITOR.helpers({
    selectProfile: function() {
    var mKey = FlowRouter.getParam('personId');
    var member = People.findOne({member_key: mKey}) || {};
    //alert('Template.dbAdminEDITOR.helpers('+ mKey);
    return member;
  }



});

