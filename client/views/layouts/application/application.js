/*****************************************************************************/
/* MasterLayout: Event Handlers and Helpers */
/*****************************************************************************/
Template.application.events({
  'click #sign-out': function (e, t) {
    Meteor.logout(function (err) {
      if (err) {
        errorMessage('Something failed logging out.');
      } else {
        Router.go('home');
      }
    });
  },
  'click #edit': function (e, t) {
    Router.go('user', {_id: Meteor.userId()});
  }
});

Template.application.helpers({

});

/*****************************************************************************/
/* MasterLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.application.created = function () {
};

Template.application.rendered = function () {
};

Template.application.destroyed = function () {
};
