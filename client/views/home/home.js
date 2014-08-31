Template.home.events({
  'submit #login-form' : function(e, t){
    e.preventDefault();
    // retrieve the input field values
    var email = t.find('#email').value,
        password = t.find('#password').value;

    Meteor.loginWithPassword(email, password, function(err){
      if (err) {
        errorMessage(err.message);
      }
      else {
        clearErrors();
        Router.go('game');
      }
    });

    return false;
  }
});
