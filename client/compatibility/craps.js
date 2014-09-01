var Craps = new function () {
  var instance;

  function initialize () {
    return new function () {
      var self = this,
          debug = false;

      self.renderer = new PIXI.autoDetectRenderer(800, 400);
      self.stage = new PIXI.Stage('0xFFFFFF', true);

      self.board = new PIXI.Sprite.fromImage("images/craps_table.png");
      self.board.position.x = 0;
      self.board.position.y = 0;

      setUpBets(debug);

      self.stage.addChild(self.board);

      self.animate = function () {
        self.renderer.render(self.stage);

        requestAnimationFrame(self.animate);
      }

      self.init = function (game) {
        if(!game) {
          return;
        }

        $('.player-list').removeClass('hidden');
        $('.current-player-tile').removeClass('hidden');
        $('.game-board').prepend(self.renderer.view);

        requestAnimationFrame(self.animate);
      }

      self.tearDown = function () {
        $('.player-list').addClass('hidden');
        $('.current-player-tile').addClass('hidden');
        $('.game-name').addClass('hidden').text('');
        $('canvas').detach();
      }

      function showBet(name) {
        $('.current-bet').removeClass('hidden');
        $('.current-bet-name').text(name)
      }

      function rectBet(name, x, y, lenght, height, debug) {
        var rect = new PIXI.Graphics();

        if(debug) {
          rect.beginFill(0xFFFF00);
          rect.drawRect(x, y, lenght, height);
          rect.endFill();
        }

        rect.hitArea = new PIXI.Rectangle(x, y, lenght, height);
        rect.interactive = true;
        rect.mousedown = function () {
          showBet(name);
        };

        return rect;
      }

      function setUpBets(debug) {

      //put in:
      // The horn
      // Hard and Horny
      // 2 or 12/Hi-Lo
      if(debug) {
        self.coordText = new PIXI.Text("coordText");
        self.coordText.x = 600;
        self.coordText.y = 50;
        self.board.addChild(self.coordText)
        self.board.interactive = true;
        self.board.mousedown = function (coords) {
          self.coordText.setText("" + coords.global.x + ", " + coords.global.y );
        }
      }

      //rect bets
      self.board.addChild(rectBet("Don't come", 102, 26, 61, 99, debug));
      self.board.addChild(rectBet('Four', 165, 26, 61, 99, debug));
      self.board.addChild(rectBet('Five', 227, 26, 61, 99, debug));
      self.board.addChild(rectBet('Six', 289, 26, 61, 99, debug));
      self.board.addChild(rectBet('Eight', 351, 26, 62, 99, debug));
      self.board.addChild(rectBet('Nine', 413, 26, 62, 99, debug));
      self.board.addChild(rectBet('Ten', 476, 26, 62, 99, debug));
      self.board.addChild(rectBet('Come', 102, 126, 373, 61, debug));
      self.board.addChild(rectBet("Don't pass bar", 165, 251, 310, 36, debug));

      //one off bets
      self.board.addChild(rectBet('7/Any Seven', 551, 150, 223, 23, debug));
      self.board.addChild(rectBet('Hard 3/Ace-Deuce', 551, 174, 111, 43, debug));
      self.board.addChild(rectBet('Hard 10', 663, 174, 111, 43, debug));
      self.board.addChild(rectBet('Hard 8', 551, 218, 111, 43, debug));
      self.board.addChild(rectBet('Hard 4', 663, 218, 111, 43, debug));
      self.board.addChild(rectBet('Hard 3', 551, 261, 73, 43, debug));
      self.board.addChild(rectBet('Hard 2/Snake Eyes/Aces', 626, 261, 73, 43, debug));
      self.board.addChild(rectBet('Hard 12/Boxcars/Midnight/Cornrows', 701, 261, 73, 43, debug));
      self.board.addChild(rectBet('Hard 11/Yo', 551, 305, 111, 43, debug));
      self.board.addChild(rectBet('Hard 11/Yo', 663, 305, 111, 43, debug));
      self.board.addChild(rectBet('Any Craps/Three-Way', 551, 350, 223, 24, debug));
      self.board.addChild(circleBet('C & E', 509, 206, 10, debug));
      self.board.addChild(circleBet('C & E', 509, 233, 10, debug));
      self.board.addChild(circleBet('C & E', 509, 260, 10, debug));
      self.board.addChild(circleBet('C & E', 509, 287, 10, debug));
      self.board.addChild(circleBet('C & E', 509, 314, 10, debug));
      self.board.addChild(circleBet('C & E', 509, 341, 10, debug));
      self.board.addChild(circleBet('C & E', 509, 368, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 362, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 337, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 312, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 287, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 262, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 238, 10, debug));
      self.board.addChild(circleBet('C & E', 534, 212, 10, debug));

      // polygon bets
      self.board.addChild(fieldBet(debug));
      self.board.addChild(dontPassBarBet(debug));
      self.board.addChild(bigSixBet(debug));
      self.board.addChild(bigEightBet(debug));
      self.board.addChild(passLineBet(debug));
      self.board.addChild(backUpBet(debug));
      }

      function circleBet(name, x, y, radius, debug) {
        var circle = new PIXI.Graphics();

        if(debug) {
          circle.beginFill(0xFFFF00);
          circle.drawCircle(x, y, radius);
          circle.endFill();
        }
        circle.hitArea = new PIXI.Circle(x, y, radius);
        circle.interactive = true;
        circle.mousedown = function () {
          showBet(name);
        };

        return circle;
      }

      function fieldBet(debug) {
        var field = new PIXI.Graphics();

        if(debug) {
          field.beginFill(0xFFFF00);
          field.moveTo(476, 189);
          field.lineTo(475, 249);
          field.lineTo(164, 249);
          field.lineTo(103, 189);
          field.endFill();
        }

        field.hitArea = new PIXI.Polygon(476, 189, 475, 249, 164, 249, 103, 189);
        field.interactive = true;
        field.mousedown = function () {
          showBet('Field');
        };

        return field;
      }

      function dontPassBarBet(debug) {
        var dontPassBar = new PIXI.Graphics();

        if(debug) {
          dontPassBar.beginFill(0xFFFF00);
          dontPassBar.moveTo(100, 188);
          dontPassBar.lineTo(100, 27);
          dontPassBar.lineTo(65, 50);
          dontPassBar.lineTo(65, 188);
          dontPassBar.endFill();
        }

        dontPassBar.hitArea = new PIXI.Polygon(100, 188, 100, 27, 65, 50, 65, 188);
        dontPassBar.interactive = true;
        dontPassBar.mousedown = function () {
          showBet("Don't pass bar");
        };

        return dontPassBar;
      }

      function bigSixBet(debug) {
        var bigSix = new PIXI.Graphics();
        if(debug) {
          bigSix.beginFill(0xFFFF00);
          bigSix.moveTo(65, 189);
          bigSix.lineTo(101, 189);
          bigSix.lineTo(132, 219);
          bigSix.lineTo(76, 276);
          bigSix.lineTo(70, 269);
          bigSix.lineTo(65, 258);
          bigSix.endFill();
        }
        bigSix.hitArea = new PIXI.Polygon(
          65, 189,
          101, 189,
          132, 219,
          76, 276,
          70, 269,
          65, 258
        );
        bigSix.interactive = true;
        bigSix.mousedown = function () {
          showBet("Big 6");
        };

        return bigSix;
      }

      function bigEightBet(debug) {
        var bigEight = new PIXI.Graphics();

        if(debug) {
          bigEight.beginFill(0xFFFF00);
          bigEight.moveTo(76, 277);
          bigEight.lineTo(133, 220);
          bigEight.lineTo(163, 251);
          bigEight.lineTo(163, 287);
          bigEight.lineTo(92, 287);
          bigEight.endFill();
        }

        bigEight.hitArea = new PIXI.Polygon(
          76, 277,
          133, 220,
          163, 251,
          163, 287,
          92, 287
        );
        bigEight.interactive = true;
        bigEight.mousedown = function () {
          showBet("Big 8");
        };

        return bigEight;
      }

      function passLineBet(debug) {
        var passLine = new PIXI.Graphics();

        if(debug) {
          passLine.beginFill(0xFFFF00);
          passLine.moveTo(63, 52);
          passLine.lineTo(27, 76);
          passLine.lineTo(27, 267);
          passLine.lineTo(37, 289);
          passLine.lineTo(49, 305);
          passLine.lineTo(67, 318);
          passLine.lineTo(90, 325);
          passLine.lineTo(475, 325);
          passLine.lineTo(475, 289);
          passLine.lineTo(93, 289);
          passLine.lineTo(72, 276);
          passLine.lineTo(64, 261);
          passLine.endFill();
        }

        passLine.hitArea = new PIXI.Polygon(
          63, 52,
          27, 76,
          27, 267,
          37, 289,
          49, 305,
          67, 318,
          90, 325,
          475, 325,
          475, 289,
          93, 289,
          72, 276,
          64, 261
        );
        passLine.interactive = true;
        passLine.mousedown = function () {
          showBet("Pass line");
        };

        return passLine;
      }

      function backUpBet(debug) {
        var backUp = new PIXI.Graphics();

        if(debug) {
          backUp.beginFill(0xFFFF00);
          backUp.moveTo(24, 77);
          backUp.lineTo(0, 77);
          backUp.lineTo(0, 400);
          backUp.lineTo(478, 400);
          backUp.lineTo(478, 327);
          backUp.lineTo(77, 325);
          backUp.lineTo(63, 319);
          backUp.lineTo(41, 301);
          backUp.lineTo(31, 283);
          backUp.lineTo(24, 265);
          backUp.endFill();
        }

        backUp.hitArea = new PIXI.Polygon(
          24, 77,
          0, 77,
          0, 400,
          478, 400,
          478, 327,
          77, 325,
          63, 319,
          41, 301,
          31, 283,
          24, 265
        );
        backUp.interactive = true;
        backUp.mousedown = function () {
          showBet("Back up");
        };

        return backUp;
      }
    }
  }

  return {
    getInstance: function () {
      if(!instance) {
        instance = initialize();
      }

      return instance;
    }
  }
}
