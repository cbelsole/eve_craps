Template.game.currentGameId = ReactiveVar('');
Template.game.currentGameSub = null;
Template.game.currentBetsSub = null;
Template.game.betHandeler = null;

Template.game.currentGame = function () {
  return Game.findOne({_id: Template.game.currentGameId.get()});
};

Template.game.rendered = function () {
  if(!Game.findOne()) {
    $('.no-games').removeClass('hidden');
  }

  Tracker.autorun(function () {
    if (Template.game.currentGameId.get()) {
      Template.game.currentGameSub = Meteor.subscribe('currentGame', Template.game.currentGameId.get());

      Template.game.currentBetsSub = Meteor.subscribe('currentGameBets', Template.game.currentGameId.get(),
        function () {
          Template.game.betHandeler = Bets.find({gameId: Template.game.currentGameId.get()}).observeChanges({
            added: function (id, fields) {
              Craps.getInstance().addBet(id, fields);
            },
            changed: function (id, fields) {
              Craps.getInstance().addBet(id, fields);
            },
            removed: function(id) {
              Craps.getInstance().removeBet(id);
            }
          });
        }
      );

      if (Template.game.currentGameSub.ready() && Template.game.currentBetsSub.ready()) {
        Craps.getInstance().init();
      }
    } else {
      if (Template.game.betHandeler) {
        Template.game.betHandeler.stop();
      }

      Craps.getInstance().tearDown();
    }
  });
}

Template.game.destroyed = function () {
  delete Template.game.currentGameSub.stop();
  delete Template.game.currentBetsSub.stop();

  if (Template.game.betHandeler) {
    Template.game.betHandeler.stop();
  }
}

Template.game.games = function () {
  return Game.find();
}

Template.game.events = {
  'click .create-game-button, keydown .create-game-name': function (event) {
    if(event.type === 'keydown' && event.keyCode !== 13) {
      return;
    }

    Game.insert({
      name: $('.create-game-name').val(),
      host: Meteor.userId(),
      players: [Meteor.user()],
      playerCount: 1
    }, function (err, id) {
      if(!err) {
        $('.create-game-name').val('');
        Template.game.currentGameId.set(id);
      }
    });
  },

  'click .game-list li': function (event) {
    var $game = $(event.currentTarget);

    $game.parent().children().each(function() {
      $(this).css('border', '');
    });

    $game.css('border', '1px solid red');


    if ($game.attr('id') != Template.game.currentGameId.get()) {
      var activeGame = Game.findOne({_id: $game.attr('id')});

      if(activeGame && _.findWhere(activeGame.players, {_id: Meteor.userId()}) != null) {
        Template.game.currentGameId.set($game.attr('id'));
      } else {
        Game.update(
          $game.attr('id'),
          { $inc: {playerCount: 1}, $push: {players: Meteor.user()} },
          function () { Template.game.currentGameId.set($game.attr('id')); }
        );
      }
    }
  },

  'click #leave-game': function () {
    Game.update(
      Template.game.currentGameId.get(),
      {
        $inc: {playerCount: -1},
        $pull: {players: Meteor.user()}
      }
    );

    Template.game.currentGameId.set('');
  },

  'change .game-list': function(event) {
    if($(event.currentTarget).children().length === 0) {
      $('.no-games').css('display', '');
    } else {
      $('.no-games').css('display', 'none');
    }
  },

  'click .current-bet button': function () {
    Bets.insert({
      gameId: Template.game.currentGameId.get(),
      userId: Meteor.userId(),
      type: $('.current-bet-name').text(),
      amount: parseInt($('.current-bet input[type=text]').val())
    });
  }
}
