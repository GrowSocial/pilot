Session.setDefault("autoSaveMode", false);

Template.updateBizaf.helpers({
  people: function () {
    return Bizness.find();
  },
  autoSaveMode: function () {
    return Session.get("autoSaveMode") ? true : false;
  },
  selectedPersonDoc: function () {
    return Bizness.findOne(Session.get("selectedPersonId"));
  },
  isSelectedPerson: function () {
    return Session.equals("selectedPersonId", this._id);
  },
  formType: function () {
    if (Session.get("selectedPersonId")) {
      return "update";
    } else {
      return "disabled";
    }
  },
  disableButtons: function () {
    return !Session.get("selectedPersonId");
  }
});

Template.updateBizaf.events({
  'click .person-row': function () {
    Session.set("selectedPersonId", this._id);
  },
  'change .autosave-toggle': function () {
    Session.set("autoSaveMode", !Session.get("autoSaveMode"));
  }
});
