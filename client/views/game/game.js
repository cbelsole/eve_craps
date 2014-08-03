Template.game.rendered = function () {
  if($.find('.remove-game').length > 0) {
    $('.no-games').css('display', 'none');
  }
}

Template.game.games = function () {
  return Game.find();
};

Template.game.hasGames = function () {
  return Game.count !== 0;
};

Template.game.events = {
  'click .remove-game': function () {
    Game.remove(this._id);

    if($.find('.remove-game').length === 0) {
      $('.no-games').css('display', '');
    }
  },

  'click .create-game': function () {
    Game.insert({
      name: $('.game-name').val(),
      host: Meteor.userId(),
      players: [Meteor.userId()]
    }, function (err, id) {
      if(!err) {
        $('.no-games').css('display', 'none');
      }
    });
  },

  'keydown .game-name': function (event) {
     if(event.keyCode == 13){
        Game.insert({
        name: $('.game-name').val(),
        host: Meteor.userId(),
        players: [Meteor.userId()]
      }, function (err, id) {
        if(!err) {
          $('.no-games').css('display', 'none');
        }
      });
    }
  },

  'click .game-list li': function (event) {
    var $li = $(event.currentTarget)
    $li.parent().children().each(function() {
      $(this).css('border', '');
    });

    $li.css('border', '1px solid red');


  }

}
