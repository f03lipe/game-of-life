// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.EventDispatcher = (function() {

    EventDispatcher.lastHoveredSquare = null;

    EventDispatcher.prototype._getMousePos = function(event) {
      var rect;
      rect = this.canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    EventDispatcher.prototype._getGridPos = function(event) {
      var coord;
      coord = this._getMousePos(event);
      return {
        x: ~~(coord.x / this.board.gridSize),
        y: ~~(coord.y / this.board.gridSize)
      };
    };

    function EventDispatcher(board, painter) {
      this.board = board;
      this.painter = painter;
      this._getGridPos = __bind(this._getGridPos, this);

      this._getMousePos = __bind(this._getMousePos, this);

      this.canvas = this.board.canvas;
      console.log("Attaching listeners to board:", this.board);
      this.detectMouseDown();
      this.detectSpacebar();
      this.detectMouseOverCanvas();
      this.detectCanvasClick();
      this.detectMouseMove();
      this.bindBoardToc();
      this.bindStopButton();
      this.bindClearButton();
      this.bindShowConfigPanel();
      this.bindHideGrid();
      this.bindBuildBoard();
    }

    EventDispatcher.prototype.bindBoardToc = function() {
      var _this = this;
      window.stateCount = 0;
      return $(this.board).bind('toc', function(event, context) {
        if (!context.empty) {
          return _this.painter.incStateCounter();
        }
      });
    };

    EventDispatcher.prototype.bindStopButton = function() {
      var _this = this;
      return $('body').on('click', 'button.haltboard', function(event) {
        if ($(event.target).hasClass('active')) {
          window.canvasStop = false;
        } else {
          window.canvasStop = true;
        }
        return true;
      });
    };

    EventDispatcher.prototype.bindClearButton = function() {
      var _this = this;
      return $("button.clearboard").click(function(event) {
        window.stateCount = 0;
        _this.board.clearBoard();
        return _this.painter.resetStateCounter();
      });
    };

    EventDispatcher.prototype.bindShowConfigPanel = function() {
      var _this = this;
      $(".show-more").click(function(event) {
        if ($('.config-panel').is(':hidden')) {
          $('.config-panel').slideDown();
          $(".show-more").find("h6").html('show less options');
          $(".show-more").find("i").removeClass("icon-circle-arrow-down").addClass("icon-circle-arrow-up");
          $(".grid-size").val(_this.board.gridSize);
          return console.log(_this.board.gridSize);
        } else {
          $('.config-panel').slideUp();
          $(".show-more").find("h6").html('show more options');
          return $(".show-more").find("i").removeClass("icon-circle-arrow-up").addClass("icon-circle-arrow-down");
        }
      });
      $('[name="refresh-rate"]').val(this.painter.fps);
      $('[name="initial-particles"]').val(this.painter.initialPop);
      return $('[name="grid-size"]').val(this.painter.gridSize);
    };

    EventDispatcher.prototype.bindHideGrid = function() {
      var _this = this;
      return $("button.hidegrid").click(function(event) {
        if ($("button.hidegrid").hasClass("active")) {
          return $("canvas#grid").fadeIn();
        } else {
          return $("canvas#grid").fadeOut();
        }
      });
    };

    EventDispatcher.prototype.bindBuildBoard = function() {
      var _this = this;
      return $("button.buildboard").click(function(event) {
        return _this.painter.changeBoardSpecs({
          fps: $('[name="refresh-rate"]').val(),
          initialPop: $('[name="initial-particles"]').val(),
          gridSize: $('[name="grid-size"]').val()
        });
      });
    };

    EventDispatcher.prototype.detectMouseDown = function() {
      var _this = this;
      window.mouseDown = false;
      $(this.canvas).mousedown(function(event) {
        return window.mouseDown = true;
      });
      return $(this.canvas).mouseup(function(event) {
        return window.mouseDown = false;
      });
    };

    EventDispatcher.prototype.detectSpacebar = function() {
      var _this = this;
      window.canvasStop = false;
      return $(document).keydown(function(event) {
        if (event.keyCode === 32) {
          if (window.canvasStop) {
            $("button.haltboard").removeClass('active');
            return window.canvasStop = false;
          } else {
            $("button.haltboard").addClass('active');
            return window.canvasStop = true;
          }
        }
      });
    };

    EventDispatcher.prototype.detectMouseOverCanvas = function() {
      window.mouseOverCanvas = false;
      $(this.canvas).mouseover(function(event) {
        return window.mouseOverCanvas = true;
      });
      return $(this.canvas).mouseout(function(event) {
        return window.mouseOuverCanvas = false;
      });
    };

    EventDispatcher.prototype.detectCanvasClick = function() {
      var _this = this;
      return $(this.canvas).mousedown(function(event) {
        var coord;
        coord = _this._getGridPos(event);
        if (!_.isEqual(coord, _this.lastHoveredSquare)) {
          console.log("Click on canvas fired at", coord);
          return _this.board.toogleSquare(coord);
        }
      });
    };

    EventDispatcher.prototype.detectMouseMove = function() {
      var _this = this;
      return $(this.canvas).mousemove(function(event) {
        var coord;
        if (window.mouseOverCanvas && window.mouseDown) {
          coord = _this._getGridPos(event);
          if (!_.isEqual(coord, _this.lastHoveredSquare)) {
            _this.lastHoveredSquare = coord;
            _this.board.addSquare(coord);
            console.log("Hovering board at square", coord);
          }
          return _this.lastHoveredSquare = coord;
        }
      });
    };

    return EventDispatcher;

  })();

}).call(this);
