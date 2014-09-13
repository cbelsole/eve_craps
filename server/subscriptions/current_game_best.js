Meteor.publish("currentGameBets", function (gameId) {
  return Bets.find(
    {gameId: gameId, active: true},
    {
      fields: {
        active: 0,
        createdAt: 0,
        modifiedAt: 0
      }
    }
  );
});
