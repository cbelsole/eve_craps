Bets.allow({
  insert: function (userId, doc) {
    return ParamValidator.isNotEmpty(doc.gameId) &&
           ParamValidator.isNotEmpty(doc.userId) &&
           Match.test(doc.amount, Number) &&
           ParamValidator.isNotEmpty(doc.type) &&
           Meteor.users.findOne({_id: doc.userId}).profile.money >= doc.amount;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return true;
  }
});

Bets.deny({
  insert: function (userId, doc) {
    return doc.userId !== userId;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return userId !== doc.userId || !doc.active;
  },

  remove: function (userId, doc) {
    return true;
  }
});

Bets.before.insert(function (userId, doc) {
  doc.active = true;
  doc.createdAt = Date.now();
});


Bets.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = _.extend({modifiedAt: Date.now()}, modifier.$set);
});
