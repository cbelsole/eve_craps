Meteor.publish("currentGameBets", function (gameId) {
  return Bets.find(
    {gameId: gameId, active: true},
    {
      fields: {
        active: 0,
        updatedAt: 0,
        modifiedAt: 0
      }
    }
  );
});
