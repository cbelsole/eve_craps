errorMessage = function (messages) {
  if(Array.isArray(messages)) {
    messages.forEach(function (message) {
      $('#error').append('<li>' + message + '</li>');
    });
  } else {
    $('#error').append('<li>' + messages + '</li>');
  }
}

clearErrors = function () {
  $('#error').empty();
}

successMessage = function (messages) {
  if(Array.isArray(messages)) {
    messages.forEach(function (message) {
      $('#success').append('<li>' + message + '</li>');
    });
  } else {
    $('#success').append('<li>' + messages + '</li>');
  }
}

clearSuccess = function () {
  $('#success').empty();
}

ParamValidator = {
  isEmpty: function (str) {
    return (!str || 0 === str.trim().length);
  },
  isEmail: function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  isValidParam: function (param, name) {
    var errors = [];

    if(this.isEmpty(param)) {
      [name + 'cannot be blank'];
    }

    return errors;
  },
  isValidEmail: function (email, confirm) {
    var errors = [];

    if(this.isEmpty(email)) {
      errors.push('Email cannot be blank');
    } else {
      if(!this.isEmail(email)) {
        errors.push('Invalid email');
      }
    }

    if(confirm && this.isEmpty(confirm)) {
      errors.push('Confirm email cannot be blank');
    } else if(confirm && !(email === confirm)) {
      errors.push('Email must match confirm email');
    }

    return errors;
  },
  isValidPassword: function (password, confirm, signUp) {
    var errors = [];

    if(this.isEmpty(password)) {
      errors.push('Password cannot be blank');
    } else {
      // maybe more validations?
      if(signUp && password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
    }

    if(confirm && this.isEmpty(confirm)) {
      errors.push('Confirm password cannot be blank');
    } else if(confirm && !(password === confirm)) {
      errors.push('Password must match confirm password');
    }

    return errors;
  },
  isValidNewPassword: function (oldPassword, newPassword) {
    var errors = [];

    if(this.isEmpty(newPassword)) {
      errors.push('New password cannot be blank');
    }

    if(this.isEmpty(oldPassword)) {
      errors.push('Old password cannot be blank');
    }

    if(!this.isEmpty(newPassword) && !this.isEmpty(oldPassword)){
      if(newPassword === oldPassword) {
        errors.push('New password cannot be the same as old password');
      }

      if (newPassword.length < 8) {
       errors.push('New password must be at least 8 characters');
      }
    }

    return errors;
  }
}
