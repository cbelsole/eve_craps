/*****************************************************************************/
/* Client and Server Routes */
/*****************************************************************************/
Router.configure({
  layoutTemplate: 'application',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  // templateNameConverter: 'upperCamelCase',
  // routeControllerNameConverter: 'upperCamelCase',
  onBeforeAction: function () {
    clearErrors();
    clearSuccess();

    if (!this.ready())
      this.render('loading')
    }
});

Router.map(function () {
  this.route('home', {path: '/'});

  this.route('game', {
    waitOn: function () { return Meteor.subscribe('gameList'); }
  });

  this.route('user_sign_up', {path: '/users/sign_up'});

  this.route('admin', {
    path: '/users/admin',
    waitOn: function () { return Meteor.subscribe('userDirectory'); }
  });

  this.route('user', {
    path: '/users/:_id',
    waitOn: function () { return Meteor.subscribe('currentUser', this.params._id); },
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });
});
