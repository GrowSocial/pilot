// guide: http://iron-meteor.github.io/iron-router/

// router capitalises template name if not defined???
Router.route('/memberProfile', {
  template: 'memberProfile',
});
Router.route('/localBusiness', {
  template: 'localBusiness',
});
Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});
