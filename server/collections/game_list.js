Meteor.publish("gameList", function (gameId) {
  return Game.find({}, {fields: {name: 1, playerCount: 1}, sort: {name: 1}});
});
