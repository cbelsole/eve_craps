Router.configure({
  layoutTemplate: 'application',
  onBeforeAction: function () {
    clearErrors();
    clearSuccess();
  }
});

Router.map(function () {
  this.route('home', {path: '/'});
  this.route('game');
  this.route('user_sign_up', {path: '/users/sign_up'});
  this.route('user', {
    path: '/users/:_id',
    data: function () { return Meteor.user(); }
  });
  // Routes to implement
  // forgot password
});
