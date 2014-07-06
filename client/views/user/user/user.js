Template.user.events({
  'submit #user-edit-form' : function(e, t){
    e.preventDefault();

    var username = t.find('#username').value,
        email = t.find('#email').value,
        password = t.find('#password').value,
        character = t.find('#character').value,
        password = t.find('#password').value,
        oldPassword = t.find('#oldPassword').value,
        errors = [],
        params = {};

    errors = errors.concat(ParamValidator.isValidEmail(email));

    if(!ParamValidator.isEmpty(password)) {
      errors = errors.concat(ParamValidator.isValidNewPassword(oldPassword, password));

      params.newPassword = password;
      params.oldPassword = oldPassword;
    }

    if(errors.length > 0) {
      errorMessage(errors);

      return false;
    }

    if(!ParamValidator.isEmpty(username)) {
      params.username = username;
    }

    if(!ParamValidator.isEmpty(email)) {
      params.email = email;
    }

    if(!ParamValidator.isEmpty(character)) {
      params.character = character;
    }

    if(!ParamValidator.isEmpty(character)) {
      params.character = character;
    }

    Meteor.call('saveUser', Meteor.userId(), params, function (err, res) {
      if (err) {
        errorMessage(err.message);
      } else {
        successMessage("User info updated.");
      }
    });



    return false;
  }
});
