ParamValidator = {
  isEmpty: function (str) {
    return (!str || 0 === str.trim().length);
  },
  isNotEmpty: function (str) {
    return !this.isEmpty(str);
  },
  isEmail: function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  isPassword: function(password) {
    return this.isNotEmpty(password) && password.length > 7;
  }
}
