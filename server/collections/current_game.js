Meteor.publish("currentGame", function (gameId) {
  return Game.find({_id: gameId});
});
