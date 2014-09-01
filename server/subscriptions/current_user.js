Meteor.publish("currentUser", function (userId) {
  if(Meteor.users.isAdmin(this.userId)) {
    return Meteor.users.find({_id: userId});
  } else {
    return Meteor.users.find({_id: this.userId});
  }
});
