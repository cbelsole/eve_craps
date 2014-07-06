Template.user_sign_up.events({
  'submit #sign-up-form' : function(e, t){
    e.preventDefault();

    var username = t.find('#username').value,
        email = t.find('#email').value,
        confirmEmail = t.find('#confirm_email').value,
        password = t.find('#password').value,
        confirmPassword = t.find('#confirm_password').value,
        character = t.find('#character').value,
        errors = [];

    errors = errors.concat(ParamValidator.isValidParam(username, 'Username'))
                   .concat(ParamValidator.isValidEmail(email, confirmEmail))
                   .concat(ParamValidator.isValidPassword(password, confirmPassword, true))
                   .concat(ParamValidator.isValidParam(character, 'Character'));

    if(errors.length > 0) {
      errorMessage(errors);

      return false;
    }

    Accounts.createUser({
      username: username,
      email: email,
      password : password,
      profile: {
        character: character
      }
    }, function(err){
      if (err) {
        errorMessage(err);
      } else {
        clearErrors();
        Router.go('game');
      }
    });

    return false;
  }
});
