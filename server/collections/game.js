/*
 * Add query methods like this:
 *  Game.findPublic = function () {
 *    return Game.find({is_public: true});
 *  }
 */

Game.allow({
  insert: function (userId, doc) {
    return true;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },

  remove: function (userId, doc) {
    return true;
  }
});

Game.deny({
  insert: function (userId, doc) {
    return ParamValidator.isEmpty(doc.name) || ParamValidator.isEmpty(doc.host);
  },

  update: function (userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function (userId, doc) {
    return userId != doc.host;
  }
});
