Meteor.users.deny({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, docs, fields, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  }
});

/* isAdmin only accessable by the server because
   Method.call does not have the logged in user
   when isAdmin is needed and I don't want to expose
   a user id.
*/
Meteor.users.isAdmin = function(userId) {
  return Meteor.users.findOne({_id: userId}).profile.admin;
};

Accounts.onCreateUser(function (options, user) {
  if(options.profile) {
    options.profile.money = 0;
    user.profile = options.profile;
  }
  return user;
});

Meteor.methods({
  isAdmin: function() {
    var user = Meteor.users.findOne({_id: this.userId});

    return user.profile.admin;
  },

  saveUser: function (userId, options) {
    if(!(userId === this.userId) && !Meteor.call('isAdmin')) {
      throw {sanitizedError: new Meteor.error(403, "You are not authorized to modify this user")};
    }

    var user = Meteor.users.findOne({_id: userId}),
        changedUser = false;
    delete user._id;

    if(!user) {
      throw {sanitizedError: new Meteor.error(404, "User does not exist")};
    }

    if(ParamValidator.isNotEmpty(options.email) &&
       ParamValidator.isEmail(options.email) &&
       user.emails[0].address !== options.email) {
      user.emails = [{address: options.email, verified: false}];
      changedUser = true;
    }

    if(ParamValidator.isNotEmpty(options.character) &&
       user.profile.character !== options.character) {
      user.profile.character = options.character;
      changedUser = true;
    }

    if(ParamValidator.isNotEmpty(options.displayName) &&
       user.profile.displayName !== options.displayName) {
      user.profile.displayName = options.displayName;
      changedUser = true;
    }

    if(ParamValidator.isNotEmpty(options.newPassword)) {
      if(!ParamValidator.isPassword(options.newPassword) ||
       ParamValidator.isNotEmpty(options.oldPassword) ||
       options.newPassword === options.oldPassword) {
        throw {sanitizedError: new Meteor.Error(400, "bad password")};
      }
    }

    if (options.money && Meteor.call('isAdmin')) {
      user.profile.money = options.money;
      changedUser = true;
    } else {
      throw {sanitizedError: new Meteor.Error(
        400,
        "you do not have permissions to add or remove money"
      )};
    }

    if(changedUser) {
      Meteor.users.update({_id: userId}, {$set: user});
    }

    if(options.newPassword) {
      Accounts.setPassword(userId, options.newPassword, function (err) {
        if(err) {
          throw {sanitizedError: new Meteor.error(500, err.message)};
        }
      });
    }

    if(!changedUser && !options.newPassword) {
      return {status: 304, message: "User not modified"};
    }

    return {status: 200, message: "User successfully modified"};
  },

  createNewUser: function(email, confEmail, pass, confPass, character, display) {
    var emailCount = Meteor.users.find({
      $or: [
        {emails: { $in: [{address: email, verified: false}]}},
        {emails: { $in: [{address: email, verified: true}]}}
      ]
    }).count();

    if(emailCount > 0) {
      throw {sanitizedError: new Meteor.Error(400, "email address is already in use")};
    }

    var characterCount = Meteor.users.find({'profile.character': character}).count();

    if(characterCount > 0) {
     throw {sanitizedError: new Meteor.Error(400, "character is already in use")};
    }

    if (!ParamValidator.isEmail(email)) {
      throw {sanitizedError: new Meteor.Error(400, "email not valid")};
    } else if (email !== confEmail) {
      throw {sanitizedError: new Meteor.Error(400, "email does not match confirm email")};
    }

    if(!ParamValidator.isPassword(pass)) {
      throw {sanitizedError: new Meteor.Error(400, "password must be at least 8 characters long")};
    } else if (pass !== confPass) {
      throw {sanitizedError: new Meteor.Error(400, "password does not match confirm password")};
    }

    if (ParamValidator.isEmpty(character)) {
      throw {sanitizedError: new Meteor.Error(400, "character name cannot be empty")};
    }

    if (ParamValidator.isEmpty(display)) {
      throw {sanitizedError: new Meteor.Error(400, "display name cannot be empty")};
    }

    Accounts.createUser(
      {email: email, password: password, profile: {character: character, displayName: displayName}},
      function (err) {
        return err;
      }
    );
  }
});
