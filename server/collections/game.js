var playerColors = ['Green', 'Brown', 'Pink', 'Yellow', 'Grey'];

Game.allow({
  insert: function (userId, doc) {
    console.log(doc)
    return ParamValidator.isNotEmpty(doc.name) &&
           ParamValidator.isNotEmpty(doc.host);
  },

  update: function (userId, doc, fieldNames, modifier) {
    if (modifier.$push && modifier.$push.players) {
      return userId === modifier.$push.players._id &&
           _.findWhere(doc.players, {_id: userId}) == null;
    } else if (modifier.$pull && modifier.$pull.players) {
      return userId === modifier.$pull.players._id &&
           _.findWhere(doc.players, {_id: userId}) != null;
    }
  }
});

Game.deny({
  insert: function (userId, doc) {
    return false;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return !doc.active;
  },

  remove: function (userId, doc) {
    return true;
  }
});

Game.before.insert(function (userId, doc) {
  doc.active = true;
  doc.createdAt = Date.now();
  doc.players[0].color = _.sample(playerColors);
});

Game.before.update(function (userId, doc, fieldNames, modifier, options) {
  if (modifier.$pull &&
      modifier.$pull.players &&
      doc.players.length === 1 &&
      doc.players[0]._id === modifier.$pull.players._id) {
    modifier.$set =  _.extend({active: false}, modifier.$set);
  }

  modifier.$set = _.extend({modifiedAt: Date.now()}, modifier.$set);
  if(modifier.$push && modifier.$push.players) {
    modifier.$push.players.color = _.sample(playerColors);
  }
});

Game.after.update(function (userId, doc, fieldNames, modifier, options) {
  if(!doc.active) {
    Bets.update(
      {gameId: doc._id, active: true},
      {$set: {active: false}},
      {multi: true}
    );
  }
});
