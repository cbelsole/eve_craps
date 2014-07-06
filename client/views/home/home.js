Template.home.events({
  'submit #login-form' : function(e, t){
    e.preventDefault();
    // retrieve the input field values
    var login = t.find('#login').value,
        password = t.find('#password').value,
        errors = [];


    errors = errors.concat(ParamValidator.isValidParam(login, 'Login'))
                   .concat(ParamValidator.isValidPassword(password));

    if(errors.length > 0) {
      errorMessage(errors);

      return false;
    }

    Meteor.loginWithPassword(login, password, function(err){
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
