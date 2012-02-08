(function() {
  var $, $$, Interaction, complete, setInteractionMask, setInteractionSetting;

  $ = window.jQuery;

  $$ = window.BASE;

  Interaction = (function() {

    Interaction.name = 'Interaction';

    function Interaction(self, options) {
      var interactionObj, opts;
      interactionObj = this;
      interactionObj.jqObj = self;
      opts = interactionObj.opts = {};
      $.extend(opts, Interaction.prototype.defaults, options);
      opts.widgetKey = $$.getRandomKey();
      return interactionObj;
    }

    Interaction.prototype.defaults = {
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

    Interaction.prototype.init = function() {
      var interactionObj, jQueryEvent, mouseDownEvent, mouseMoveEvent, mouseUpEvent, obj, opts, self;
      interactionObj = this;
      self = interactionObj.jqObj;
      opts = interactionObj.opts;
      jQueryEvent = self.off ? 'on' : 'bind';
      if (opts.type === 'resize') {
        obj = self.find('.uiResizable');
        if (obj.length === 0) {
          if (self.css('position' === 'static')) self.css('position', 'relative');
          obj = ($('<div class="uiResizable"></div>')).appendTo(self);
        }
      } else if (opts.type === 'drag') {
        obj = self.find('.uiDraggable');
        if (obj.length === 0) obj = self.addClass('uiDraggable');
      }
      mouseDownEvent = "mousedown." + opts.type;
      obj[jQueryEvent](mouseDownEvent, function(e) {
        setInteractionSetting(self, opts, e);
        if (opts.type === 'resize') return false;
        return !opts.stopMouseDownPropagation;
      });
      mouseMoveEvent = "mousemove." + opts.widgetKey;
      mouseUpEvent = "mouseup." + opts.widgetKey;
      ($(document))[jQueryEvent](mouseMoveEvent, function(e) {
        var maskItem, newHeight, newWidth, offsetX, offsetY, position;
        if (opts.start) {
          if (opts.mask === null) {
            if ((setInteractionMask(self, opts, e)) === false) return;
          }
          maskItem = opts.mask;
          opts.doing = true;
          offsetX = e.clientX - opts.originClientX;
          offsetY = e.clientY - opts.originClientY;
          if (opts.type === 'resize') {
            newWidth = opts.originWidth + offsetX;
            newHeight = opts.originHeight + offsetY;
            if (opts.maxWidth !== null) {
              if (newWidth > opts.maxWidth) newWidth = opts.maxWidth;
            }
            if (opts.minWidth !== null) {
              if (newWidth < opts.minWidth) newWidth = opts.minWidth;
            }
            if (opts.maxHeight !== null) {
              if (newHeight > opts.maxHeight) newHeight = opts.maxHeight;
            }
            if (opts.minHeight !== null) {
              if (newHeight < opts.minHeight) newHeight = opts.minHeight;
            }
            if ((opts.event.doing(self, maskItem, newWidth, newHeight)) === false) {
              return;
            }
            (maskItem.width(newWidth)).height(newHeight);
          } else if (opts.type === 'drag') {
            position = {
              left: opts.originPosition.left + offsetX,
              top: opts.originPosition.top + offsetY
            };
            if ((opts.event.doing(self, maskItem, position)) === false) return;
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
      ($(document))[jQueryEvent](mouseUpEvent, function() {
        return complete(self, opts);
      });
      return interactionObj;
    };

    return Interaction;

  })();

  complete = function(self, opts) {
    var maskItem, offset;
    if (opts.doing === false) {
      opts.start = false;
      return;
    }
    maskItem = opts.mask;
    opts.start = opts.doing = false;
    if (opts.type === 'resize') {
      if ((opts.event.stop(self, maskItem, maskItem.width(), maskItem.height())) === false) {
        return;
      }
    } else if (opts.type === 'drag') {
      offset = maskItem.offset();
      if ((opts.event.stop(self, maskItem, offset)) === false) return;
    }
    maskItem.remove();
    return opts.mask = null;
  };

  setInteractionSetting = function(self, opts, e) {
    opts.start = true;
    if ((opts.event.start(self)) === false || (($(e.target)).hasClass('uiUserBtn'))) {
      opts.start = false;
      return false;
    }
  };

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
      opts.mask = (self.clone().css({
        position: 'absolute',
        left: maskPosition.left,
        top: maskPosition.top
      })).appendTo('body');
    } else {
      marginLeftValue = self.css('marginLeft');
      marginTopValue = self.css('marginTop');
      opts.mask = ((((($(opts.maskHTML)).width(maskWidth)).height(maskHeight)).css({
        marginLeft: marginLeftValue,
        marginTop: marginTopValue,
        left: maskPosition.left,
        top: maskPosition.top
      })).hide().addClass('uiBlackBigBorder uiCornerAll')).appendTo('body');
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

}).call(this);
