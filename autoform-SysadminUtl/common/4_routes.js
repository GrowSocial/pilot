Router.configure({
  notFoundTemplate: 'not_found',
  loadingTemplate: 'loading',
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'home'});
Router.route('/quickform', {name: 'quickform'});
Router.route('/insertaf', {name: 'insertaf'});
Router.route('/updateaf', {name: 'updateaf'});
Router.route('/updateBizaf', {name: 'updateBizaf'});



