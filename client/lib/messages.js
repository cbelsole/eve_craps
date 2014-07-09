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
