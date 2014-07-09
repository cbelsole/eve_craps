Meteor.methods({
  saveUser: function (userId, options) {
    if(!(userId === this.userId)) {
      throw new Meteor.error(403, "You are not authorized to modify this user.");
    }
    var user = Meteor.users.findOne({_id: userId});
    delete user._id;

    if(!user) {
      throw new Meteor.error(404, "User does not exist");
    }

    if(options.username) {
      user.username = options.username;
    }

    if(options.email) {
      user.emails = [{address: options.email, verified: false}];
    }

    if(options.character) {
      user.profile.character = options.character;
    }

    if(
      options.newPassword && options.oldPassword &&
      options.newPassword === options.oldPassword
    ) {
      return {status: 400, message: "bad password data."}
    }

    Meteor.users.update({_id:Meteor.userId()}, {$set: user});

    Accounts.setPassword(userId, options.newPassword, function (err) {
      if(err) {
        throw new Meteor.error(500, err.message)
      }
    });

    return {status: 200, message: "User successfully modified."}
  }
});
