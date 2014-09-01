Meteor.publish("gameList", function (gameId) {
  return Game.find({active: true}, {fields: {name: 1, playerCount: 1}, sort: {name: 1}});
});
