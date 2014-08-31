Meteor.publish("userDirectory", function () {
  return Meteor.users.find({}, {fields: {
    profile: 1,
    email: 1
  }});
});
