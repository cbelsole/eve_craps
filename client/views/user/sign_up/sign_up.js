Template.user_sign_up.events({
  'submit #sign-up-form' : function(e, t){
    e.preventDefault();

    var email = t.find('#email').value,
        confirmEmail = t.find('#confirm_email').value,
        password = t.find('#password').value,
        confirmPassword = t.find('#confirm_password').value,
        character = t.find('#character').value,
        displayName = t.find('#display_name').value,
        errors = [],
        userinfo;

    errors = errors.concat(ParamValidator.isValidEmail(email, confirmEmail))
                   .concat(ParamValidator.isValidPassword(password, confirmPassword, true))
                   .concat(ParamValidator.isValidParam(character, 'Character'))
                   .concat(ParamValidator.isValidParam(displayName, 'Display Name'));

    if(errors.length > 0) {
      errorMessage(errors);

      return false;
    }

    Accounts.createUser({email: email, password: password, profile: {character: character, displayName: displayName}}, function (err) {
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
