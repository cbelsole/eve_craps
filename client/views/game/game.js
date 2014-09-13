Template.game.subs = {};
Template.game.currentGameId = ReactiveVar('');
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
      Template.game.subs['currentGame'] = Meteor.subscribe(
        'currentGame',
        Template.game.currentGameId.get()
      );

      Template.game.subs['currentGameBets'] = Meteor.subscribe(
        'currentGameBets',
        Template.game.currentGameId.get()
      );

      if (Template.game.subs['currentGame'].ready() &&
          Template.game.subs['currentGameBets'].ready()) {
        Craps.getInstance().init();
      }
    } else {
      if (Template.game.betHandeler) {
        Template.game.betHandeler.stop();
      }
      Craps.getInstance().tearDown();
    }
  });

  Tracker.autorun(function () {
    if (Template.game.currentGameId.get() &&
        Template.game.subs['currentGameBets'] &&
        Template.game.subs['currentGameBets'].ready()) {
      Template.game.betHandeler = Bets.find({gameId: Template.game.currentGameId.get()}).observeChanges({
        added: function (id, fields) {
          console.log('added bet');
          Craps.getInstance().addBet(id, fields);
        },
        changed: function (id, fields) {
          console.log('changed bet');
          Craps.getInstance().addBet(id, fields);
        }
      });
    }
  });
}

Template.game.destroyed = function () {
  delete Template.game.subs['currentGame'];
  delete Template.game.subs['currentGameBets'];

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

    if (Template.game.betHandeler) {
      Template.game.betHandeler.stop();
    }

    Game.update(
      $game.attr('id'),
      { $inc: {playerCount: 1}, $push: {players: Meteor.user()} },
      function () { Template.game.currentGameId.set($game.attr('id')); }
    );
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
