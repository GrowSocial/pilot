// http://iron-meteor.github.io/iron-router/

Router.route('/memberProfile');
Router.route('/localBusiness');
Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});
