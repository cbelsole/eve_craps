Template.user_sign_up.events({
  'submit #sign-up-form' : function(e, t){
    e.preventDefault();

    var email = t.find('#email').value,
        confirmEmail = t.find('#confirmEmail').value,
        password = t.find('#password').value,
        confirmPassword = t.find('#confirmPassword').value,
        character = t.find('#character').value,
        displayName = t.find('#displayName').value,
        response = Meteor.call(
          'createNewUser',
          email,
          confirmEmail,
          password,
          confirmPassword,
          character,
          displayName,
          function (error) {
            if(error) {
              errorMessage(error.message);
            } else {
              clearErrors();
              Router.go('game');
            }
          });

    return false;
  }
});
