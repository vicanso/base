(function() {
  var $, $$, Interaction, checkArea, complete, setInteractionMask, setInteractionSetting,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  Interaction = (function() {
    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} options [description]
     * @return {[Interaction]}         [description]
    */

    function Interaction(self, options) {
      var defaults, interactionObj;
      interactionObj = this;
      interactionObj.jqObj = self;
      interactionObj.opts = {};
      defaults = {
        disable: false,
        getUserMask: null,
        originMask: false,
        stopMouseDownPropagation: false,
        start: false,
        originClientX: 0,
        originClientY: 0,
        doing: false,
        type: null,
        mask: null,
        event: {
          start: $.noop,
          doing: $.noop,
          stop: $.noop
        },
        maskHTML: '<div class="uiInteractionMask uiInactive uiCornerAll uiBlackBigBorder"></div>'
      };
      $.extend(interactionObj.opts, defaults, options);
      interactionObj.opts.widgetKey = $$.getRandomKey();
    }

    /**
     * [init description]
     * @return {[Interaction]} [description]
    */


    Interaction.prototype.init = function() {
      var interactionObj, mouseDownEvent, mouseMoveEvent, mouseUpEvent, obj, opts, self;
      interactionObj = this;
      self = interactionObj.jqObj;
      opts = interactionObj.opts;
      if (opts.type === 'resize') {
        obj = self.find('.uiResizable');
        if (obj.length === 0) {
          if (self.css('position' === 'static')) {
            self.css('position', 'relative');
          }
          obj = ($('<div class="uiResizable"></div>')).appendTo(self);
        }
      } else if (opts.type === 'drag') {
        obj = self.find('.uiDraggable');
        if (obj.length === 0) {
          obj = self.addClass('uiDraggable');
        }
      }
      mouseDownEvent = "mousedown." + opts.type;
      obj.on(mouseDownEvent, function(e) {
        setInteractionSetting(self, opts, e);
        if (opts.type === 'resize') {
          return false;
        }
        return !opts.stopMouseDownPropagation;
      });
      mouseMoveEvent = "mousemove." + opts.widgetKey;
      mouseUpEvent = "mouseup." + opts.widgetKey;
      $(document).on(mouseMoveEvent, function(e) {
        var maskItem, newHeight, newWidth, offsetX, offsetY, position;
        if (opts.start) {
          if (opts.mask === null) {
            if ((setInteractionMask(self, opts, e)) === false) {
              return;
            }
          }
          maskItem = opts.mask;
          opts.doing = true;
          offsetX = e.clientX - opts.originClientX;
          offsetY = e.clientY - opts.originClientY;
          if (opts.type === 'resize') {
            newWidth = opts.originWidth + offsetX;
            newHeight = opts.originHeight + offsetY;
            if (opts.maxWidth !== null) {
              if (newWidth > opts.maxWidth) {
                newWidth = opts.maxWidth;
              }
            }
            if (opts.minWidth !== null) {
              if (newWidth < opts.minWidth) {
                newWidth = opts.minWidth;
              }
            }
            if (opts.maxHeight !== null) {
              if (newHeight > opts.maxHeight) {
                newHeight = opts.maxHeight;
              }
            }
            if (opts.minHeight !== null) {
              if (newHeight < opts.minHeight) {
                newHeight = opts.minHeight;
              }
            }
            if ((opts.event.doing(self, maskItem, newWidth, newHeight)) === false) {
              return;
            }
            maskItem.width(newWidth).height(newHeight);
          } else if (opts.type === 'drag') {
            position = {
              left: opts.originPosition.left + offsetX,
              top: opts.originPosition.top + offsetY
            };
            if ((opts.event.doing(self, maskItem, position)) === false) {
              return;
            }
            maskItem.css(position);
            if (opts.dest !== null) {
              if ((checkArea(opts, position, opts.destPosition)) === true) {
                if (!opts.firstCross) {
                  opts.cross(self, true);
                  opts.firstCross = true;
                }
              } else {
                if (opts.firstCross) {
                  opts.cross(self, false);
                  opts.firstCross = false;
                }
              }
            }
          }
          return false;
        }
      });
      $(document).on(mouseUpEvent, function() {
        return complete(self, opts);
      });
      return interactionObj;
    };

    return Interaction;

  })();

  /**
   * [complete description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


  complete = function(self, opts) {
    var maskItem, offset;
    if (opts.doing === false) {
      opts.start = false;
      return null;
    }
    maskItem = opts.mask;
    opts.start = opts.doing = false;
    if (opts.type === 'resize') {
      if ((opts.event.stop(self, maskItem, maskItem.width(), maskItem.height())) === false) {
        return null;
      }
    } else if (opts.type === 'drag') {
      offset = maskItem.offset();
      if ((opts.event.stop(self, maskItem, offset)) === false) {
        return null;
      }
    }
    maskItem.remove();
    opts.mask = null;
    return null;
  };

  /**
   * [setInteractionSetting description]
   * @param {[jQuery]} self [description]
   * @param {[Object]} opts [description]
   * @param {[Event]} e    [description]
  */


  setInteractionSetting = function(self, opts, e) {
    opts.start = true;
    if ((opts.event.start(self)) === false || $(e.target).hasClass('uiUserBtn')) {
      opts.start = false;
      return false;
    }
    return null;
  };

  /**
   * [setInteractionMask description]
   * @param {[jQuery]} self [description]
   * @param {[Object]} opts [description]
   * @param {[Event]} e    [description]
   * @return {[Boolean]}  [description]
  */


  setInteractionMask = function(self, opts, e) {
    var dest, marginLeftValue, marginTopValue, maskHeight, maskPosition, maskWidth;
    maskHeight = self.outerHeight();
    maskWidth = self.outerWidth();
    maskPosition = self.offset();
    opts.originClientX = e.clientX;
    opts.originClientY = e.clientY;
    opts.outerHeight = maskHeight;
    opts.outerWidth = maskWidth;
    opts.originWidth = self.width();
    opts.originHeight = self.height();
    opts.originPosition = opts.position = maskPosition;
    if ($.isFunction(opts.getUserMask)) {
      opts.mask = opts.getUserMask(self);
      if (opts.mask.length === 0) {
        opts.mask = null;
        opts.start = false;
        return false;
      } else {
        opts.position = opts.originPosition = opts.mask.offset();
      }
    } else if (opts.originMask) {
      opts.mask = self.clone().css({
        position: 'absolute',
        left: maskPosition.left,
        top: maskPosition.top
      }).appendTo('body');
    } else {
      marginLeftValue = self.css('marginLeft');
      marginTopValue = self.css('marginTop');
      opts.mask = $(opts.maskHTML).width(maskWidth).height(maskHeight).css({
        marginLeft: marginLeftValue,
        marginTop: marginTopValue,
        left: maskPosition.left,
        top: maskPosition.top
      }).hide().addClass('uiBlackBigBorder uiCornerAll').appendTo('body');
    }
    opts.mask.show();
    if (opts.type === 'drag' && opts.dest !== null) {
      dest = $(opts.dest);
      opts.destPosition = [];
      dest.each(function() {
        var destHeight, destWidth, obj, pos;
        obj = $(this);
        pos = obj.offset();
        destWidth = obj.width();
        destHeight = obj.height();
        return opts.destPosition.push({
          leftTop: [pos.left, pos.top],
          rightBottom: [pos.left + destWidth, pos.top + destHeight]
        });
      });
    }
    return true;
  };

  /**
   * [checkArea description]
   * @param  {[Object]} opts            [description]
   * @param  {[Object]} position        [description]
   * @param  {[Array]} destPositionArr [description]
   * @return {[Boolean]}                 [description]
  */


  checkArea = function(opts, position, destPositionArr) {
    var bottom, check, crossFlag, left, pos, right, top, _i, _len;
    left = position.left;
    top = position.top;
    right = left + opts.outerWidth;
    bottom = top + opts.outerHeight;
    crossFlag = false;
    check = function(pos) {
      if (!(left > pos.rightBottom[0] || right < pos.leftTop[0] || bottom < pos.leftTop[0] || top > pos.rightBottom[1])) {
        return true;
      } else {
        return false;
      }
    };
    for (_i = 0, _len = destPositionArr.length; _i < _len; _i++) {
      pos = destPositionArr[_i];
      if ((check(pos)) === true) {
        crossFlag = true;
        break;
      }
    }
    return crossFlag;
  };

  /**
   * [draggable description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[jQuery]}         [description]
  */


  $.fn.draggable = function(options) {
    var draggableObj, self;
    self = this;
    draggableObj = new $$.Draggable(self, options);
    draggableObj.init(self, draggableObj.opts);
    return self;
  };

  $$.Draggable = (function(_super) {

    __extends(Draggable, _super);

    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} {[Optional]} options [description]
     * @return {[Draggable]}         [description]
    */


    function Draggable(self, options) {
      var defaults, draggableObj, opts;
      draggableObj = this;
      if (!(draggableObj instanceof $$.Draggable)) {
        return new $$.Draggable(self, options);
      }
      defaults = {
        dest: null,
        originPosition: null,
        position: null,
        outerWidth: null,
        outerHeight: null,
        destPosition: null,
        firstCross: false,
        type: "drag",
        widgetKey: null,
        cross: null
      };
      opts = $.extend({}, defaults, options);
      draggableObj.constructor.__super__.constructor.call(draggableObj, self, opts);
      opts = draggableObj.opts;
      if (opts.event.stop === $.noop) {
        opts.event.stop = function(mask, offset) {
          self.moveToPos({
            position: offset
          });
          return null;
        };
      }
    }

    return Draggable;

  })(Interaction);

  /**
   * [resizable description]
   * @param  {[Object]} options [description]
   * @return {[jQuery]}         [description]
  */


  $.fn.resizable = function(options) {
    var resizableObj, self;
    self = this;
    resizableObj = new $$.Resizable(self, options);
    resizableObj.init(self, resizableObj.opts);
    return self;
  };

  $$.Resizable = (function(_super) {

    __extends(Resizable, _super);

    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} {[Optional]} options [description]
     * @return {[Resizable]}         [description]
    */


    function Resizable(self, options) {
      var defaults, opts, resizableObj;
      resizableObj = this;
      if (!(resizableObj instanceof $$.Resizable)) {
        return new $$.Resizable(self, options);
      }
      defaults = {
        minWidth: null,
        minHeight: null,
        maxWidth: 0xffff,
        maxHeight: 0xffff,
        originWidth: 0,
        originHeight: 0,
        type: "resize",
        outerWidth: null,
        outerHeight: null,
        destPosition: null
      };
      opts = $.extend({}, defaults, options);
      resizableObj.constructor.__super__.constructor.call(resizableObj, self, opts);
      opts = resizableObj.opts;
      if (opts.event.stop === $.noop) {
        opts.event.stop = function(resizeObj, mask, width, height) {
          var content, otherItemHeightTotal, outerOffset;
          if ((opts.resizeStop(self)) === false) {
            return false;
          }
          height = Math.min(Math.max(opts.minHeight, height), opts.maxHeight);
          width = Math.min(Math.max(opts.minWidth, width), opts.maxWidth);
          otherItemHeightTotal = 0;
          content = ((self.width(width)).height(height)).children('.uiContent');
          self.children().each(function() {
            var obj;
            obj = $(this);
            if (!obj.hasClass('uiContent' && !(obj.hasClass('uiResizable')))) {
              return otherItemHeightTotal += ($(this)).outerHeight(true);
            }
          });
          outerOffset = (content.outerHeight(true)) - content.height();
          content.height(height - otherItemHeightTotal - outerOffset);
          return null;
        };
      }
    }

    return Resizable;

  })(Interaction);

}).call(this);
