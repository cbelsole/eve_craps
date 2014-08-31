Template.user.events({
  'submit #user-edit-form' : function(e, t){
    e.preventDefault();

    var params = {};

    $('input:not(.btn)').each(function () {
      params[this.id] = this.value;
    });

    Meteor.call('saveUser', $('input[type=submit]').attr('id'), params, function (err, res) {
      if (err) {
        errorMessage(err.message);
      } else {
        successMessage(res.message);
      }
    });

    return false;
  }
});

Template.user.helpers({
  isAdmin: function () {
    if(Meteor.user()) {
      return Meteor.user().profile.admin;
    }
  }
});
