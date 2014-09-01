Meteor.publish("currentGame", function (gameId) {
  return Game.find(
    {_id: gameId, active: true},
    {fields:{
      active: 0,
      updatedAt: 0,
      modifiedAt: 0,
      'players.emails': 0,
      'players.profile.character': 0,
      'players.profile.admin': 0,
      'players.profile.money': 0
    }
  });
});
