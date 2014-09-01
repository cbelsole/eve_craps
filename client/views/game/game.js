Template.game.subs = {};

Template.game.isEqual = function(value1, value2) {
  return value1 === value2;
}

Template.game.rendered = function () {
  if(!Game.findOne()) {
    $('.no-games').removeClass('hidden');
  }

  Deps.autorun(function () {
    if (Session.get('currentGameId')) {
      Template.game.subs['currentGame'] = Meteor.subscribe('currentGame', Session.get('currentGameId'));
      if (Template.game.subs['currentGame'].ready()) {
        var game = Game.findOne({_id: Session.get('currentGameId')}),
            craps = Craps.getInstance();
        craps.init(game);
      }
    } else {
      Craps.getInstance().tearDown();
    }
  });


  Deps.autorun(function () {
    if (Session.get('currentGameId') && Template.game.subs['currentGame'].ready()) {
      $('.game-name').removeClass('hidden');
      Session.set('currentGame', Game.findOne({_id: Session.get('currentGameId')}));
    }
  });
}

Template.game.destroyed = function () {
  Session.set('currentGameId', null);
  Session.set('currentGame', null);
  delete Template.game.subs['currentGame'];
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
  }
}
