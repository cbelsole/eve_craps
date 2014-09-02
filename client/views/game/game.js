Template.game.subs = {};
Template.game.betHandeler = null;

Template.game.isEqual = function(value1, value2) {
  return value1 === value2;
}

Template.game.rendered = function () {
  if(!Game.findOne()) {
    $('.no-games').removeClass('hidden');
  }

  Deps.autorun(function () {
    if (Session.get('currentGameId')) {
      Template.game.subs['currentGame'] = Meteor.subscribe(
        'currentGame',
        Session.get('currentGameId')
      );

      Template.game.subs['currentGameBets'] = Meteor.subscribe(
        'currentGameBets',
        Session.get('currentGameId')
      );

      if (Template.game.subs['currentGame'].ready() &&
          Template.game.subs['currentGameBets'].ready()) {
        var game = Game.findOne({_id: Session.get('currentGameId')}),
            bets = Bets.find({gameId: Session.get('currentGameId')});

        $('.game-name').removeClass('hidden');
        Session.set('currentGame', game);
        Craps.getInstance().init(game);

        $.each(bets.fetch(), function () {
          console.log('running each bet');
          Craps.getInstance().addBet(this._id, this);
        });

        Template.game.betHandeler = bets.observe({
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
    } else {
      Craps.getInstance().tearDown();
    }
  });
}

Template.game.destroyed = function () {
  Session.set('currentGameId', null);
  Session.set('currentGame', null);
  delete Template.game.subs['currentGame'];
  delete Template.game.subs['currentGameBets'];

  if (Template.game.betHandeler) {
    Template.game.betHandeler.stop();
  }
}

Template.game.games = function () {
  return Game.find();
}

Template.game.currentGame = function () {
  return Session.get('currentGame');
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
        Session.set('currentGameId', id);
      }
    });
  },

  'click .game-list li': function (event) {
    var $game = $(event.currentTarget);

    $game.parent().children().each(function() {
      $(this).css('border', '');
    });

    $game.css('border', '1px solid red');

    if(Game.find({'players._id': Meteor.userId()}).count() === 0) {
      Game.update(
        $game.attr('id'),
        {
          $inc: {playerCount: 1},
          $push: {players: Meteor.user()}
        }
      );
    }

    if(_.findWhere(Game.findOne({_id: $game.attr('id')}).players, {_id: Meteor.userId()})) {
      Session.set('currentGameId', $game.attr('id'));
    }
  },

  'click #leave-game': function () {
    Session.get('currentGameId')

    Game.update(
      Session.get('currentGameId'),
      {
        $inc: {playerCount: -1},
        $pull: {players: Meteor.user()}
      }
    );

    Session.set('currentGameId', '');
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
      gameId: Session.get('currentGameId'),
      userId: Meteor.userId(),
      active: true,
      type: $('.current-bet-name').text(),
      amount: parseInt($('.current-bet input[type=text]').val())
    });
  }
}
