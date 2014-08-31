Template.admin.users = function () {
  return Meteor.users.find({});
}

Template.admin.events({
  'click li': function (e, t) {
      Router.go('user', {_id: e.currentTarget.id});
    }
})
