Accounts.onCreateUser(function (options, user) {
  if(options.profile) {
    options.profile.money = 0;
    user.profile = options.profile;
  }
  return user;
});

Meteor.methods({
  saveUser: function (userId, options) {
    if(!(userId === this.userId)) {
      throw new Meteor.error(403, "You are not authorized to modify this user");
    }

    var user = Meteor.users.findOne({_id: userId}),
        changedUser = false;
    delete user._id;

    if(!user) {
      throw new Meteor.error(404, "User does not exist");
    }

    if(options.email && user.emails[0].address !== options.email) {
      user.emails = [{address: options.email, verified: false}];
      changedUser = true;
    }

    if(options.character && user.profile.character !== options.character) {
      user.profile.character = options.character;
      changedUser = true;
    }

    if(options.displayName &&
       user.profile.displayName !== options.displayName) {
      user.profile.displayName = options.displayName;
      changedUser = true;
    }

    if(options.newPassword &&
       options.oldPassword &&
       options.newPassword === options.oldPassword) {
      return {status: 400, message: "bad password data"}
    }

    if(options.email || options.character || options.displayName) {
      Meteor.users.update({_id:Meteor.userId()}, {$set: user});
    }

    if(options.newPassword) {
      Accounts.setPassword(userId, options.newPassword, function (err) {
        if(err) {
          throw new Meteor.error(500, err.message)
        }
      });
    }

    if(!changedUser) {
      return {status: 304, message: "User not modified"}
    }

    return {status: 200, message: "User successfully modified"}
  }
});
