(function() {
  var $, $$, RandomString;

  $$ = window.BASE = window.BASE || {};

  $ = window.jQuery;

  RandomString = (function() {

    RandomString.name = 'RandomString';

    function RandomString(legalCharList) {
      var defaultLegalChar;
      defaultLegalChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      if (legalCharList) {
        this.legalCharList = legalCharList.split("");
      } else {
        this.legalCharList = defaultLegalChar.split("");
      }
      this.legalListLength = this.legalCharList.length;
    }

    RandomString.prototype.getRandomStr = function(len) {
      var num;
      if (len == null) len = 10;
      return ((function() {
        var _i, _results;
        _results = [];
        for (num = _i = 1; _i <= 10; num = ++_i) {
          _results.push(this.getRandomChar(num));
        }
        return _results;
      }).call(this)).join("");
    };

    RandomString.prototype.getRandomChar = function() {
      return this.legalCharList[Math.floor(Math.random() * this.legalListLength)];
    };

    return RandomString;

  })();

  $.extend($$, {
    version: "0.8.1",
    msie6: $.browser.msie && $.browser.version === "6.0",
    defaultAnimateDuration: 300,
    defaultBorder: "uiBlueBorder",
    defaultBoxShadow: "uiBlueBoxShadow",
    defaultGradientBG: "uiBlueGradientBG",
    hoverGradientBG: "uiLightBlueGradientBG",
    selectedGradientBG: "uiRedGradientBG",
    cssShow: {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    widgetType: {
      uiDialog: "dialog",
      uiTabs: "tabs",
      uiSlide: "slide",
      uiAccordion: "accordion",
      uiButtonSet: "buttonSet",
      uiDorpDownList: "dropDownList",
      uiProgressBar: "progressBar",
      uiTip: "tip",
      uiList: "list",
      uiDatePicker: "datePicker",
      uiTree: "tree",
      uiGrid: "grid"
    },
    widgetDictionary: {},
    randomKey: new RandomString(),
    getWidget: function(key) {
      var widget;
      widget = this.widgetDictionary[key];
      if (widget != null) return widget;
    },
    addWidget: function(key, widget) {
      if ((key != null) && (widget != null)) {
        return this.widgetDictionary[key] = widget;
      }
    },
    removeWidget: function(key) {
      var opts, prop, widget;
      widget = this.widgetDictionary[key];
      if (notdelete(this.widgetDictionary[key])) this.widgetDictionary[key] = null;
      if (widget != null) opts = widget.opts;
      for (prop in opts) {
        if (opts.hasOwnProperty(prop)) if (!(delete opts[prop])) opts[prop] = null;
      }
      for (prop in widget) {
        if (widget.hasOwnProperty(prop)) {
          if (!(delete widget[prop])) widget[prop] = null;
        }
      }
      return true;
    },
    getRandomKey: function(length) {
      return this.randomKey.getRandomStr(length);
    },
    inherit: function(subClass, superClass, subFunction) {
      var tmpClass;
      if (!($.isFunction(subClass)) || !($.isFunction(superClass))) {
        $.error("继承出错");
      }
      tmpClass = function() {};
      tmpClass.prototype = superClass.prototype;
      subClass.prototype = new tmpClass();
      subClass.prototype.constructor = subClass;
      subClass.prototype.superClass = superClass;
      $.extend(subClass.prototype, subFunction);
      return true;
    },
    createWidgetByJQuery: function() {
      var args, constructor, options, self, widgetKey, widgetObj;
      self = this;
      args = Array.prototype.slice.call(arguments);
      constructor = args.pop();
      options = args[0];
      if (typeof options === "string") {
        widgetKey = self.attr("widget");
        if (widgetKey != null) {
          widgetObj = $$.getWidget(widgetKey);
          return widgetObj.selectHandle.apply(widgetObj, args);
        }
      } else {
        widgetObj = new constructor(self, options);
      }
      return self;
    }
  });

}).call(this);
(function() {
  var $, getColor, getRGB;

  $ = window.jQuery;

  $.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'borderColor', 'color', 'outlineColor'], function(i, attr) {
    return $.fx.step[attr] = function(fx) {
      var bColor, gColor, rColor;
      if (!fx.colorInit) {
        fx.start = getColor(fx.elem, attr);
        fx.end = getRGB(fx.end);
        fx.colorInit = true;
      }
      rColor = Math.max(Math.min(parseInt(fx.pos * (fx.end[0] - fx.start[0]) + fx.start[0], 10), 255), 0);
      gColor = Math.max(Math.min(parseInt(fx.pos * (fx.end[1] - fx.start[1]) + fx.start[1], 10), 255), 0);
      bColor = Math.max(Math.min(parseInt(fx.pos * (fx.end[2] - fx.start[2]) + fx.start[2], 10), 255), 0);
      return fx.elem.style[attr] = 'rgb(' + rColor + ',' + gColor + ',' + bColor + ')';
    };
  });

  getRGB = function(color) {
    var result;
    if (color && color.constructor === Array && color.length === 3) return color;
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
      return [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10)];
    }
    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) {
      return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
    }
    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) {
      return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) {
      return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
    }
    if (result = /rgba\(0, 0, 0, 0\)/.exec(color)) return colors['transparent'];
    return colors[($.trim(color)).toLowerCase()];
  };

  getColor = function(elem, attr) {
    var color;
    while (elem != null) {
      color = $.curCSS(elem, attr);
      if (color !== '' && (color !== 'transparent') || $.nodeName(elem, 'body')) {
        break;
      }
      attr = "backgroundColor";
      elem = elem.parentNode;
    }
    return getRGB(color);
  };

}).call(this);
(function() {
  var $, $$, widgetDestroy;

  $$ = window.BASE = window.BASE || {};

  $ = window.jQuery;

  $$.Widget = (function() {

    Widget.name = 'Widget';

    function Widget(self, options) {
      var defaults, widgetObj;
      widgetObj = this;
      if (!(widgetObj instanceof $$.Widget)) return new $$.Widget(self, options);
      widgetObj.jqObj = self;
      defaults = {
        widgetKey: null,
        animateTime: $$.defaultAnimateDuration,
        disabled: false,
        minPosition: "bottom",
        clone: null
      };
      widgetObj.opts = $.extend(defaults, options);
    }

    Widget.prototype.selectHandle = function() {
      var args, func, widgetObj;
      args = Array.prototype.slice.call(arguments);
      widgetObj = this;
      func = args.shift();
      if ($.isFunction(widgetObj[func])) {
        return widgetObj[func].apply(widgetObj, args);
      }
      return null;
    };

    Widget.prototype.self = function() {
      return this.jqObj;
    };

    Widget.prototype.createWidget = function() {
      var opts, self, widgetObj;
      widgetObj = this;
      opts = widgetObj.opts;
      self = widgetObj.jqObj;
      opts.clone = self.clone();
      opts.widgetKey = $$.getRandomKey();
      self.attr('widget', opts.widgetKey);
      widgetObj.widget(opts.widgetKey, widgetObj);
      return widgetObj;
    };

    Widget.prototype.widget = function() {
      if (arguments.length === 2) {
        return $$.addWidget(arguments[0], arguments[1]);
      } else if (arguments.length === 1) {
        return $$.getWidget(arguments[0]);
      }
      return this;
    };

    Widget.prototype.removeWidget = function(key) {
      if (key != null) $$.removeWidget(key);
      return true;
    };

    Widget.prototype.disable = function() {
      var widgetObj;
      widgetObj = this;
      widgetObj.opts.disabled = true;
      widgetObj.jqObj.addClass('uiWidgetDisalbed');
      return widgetObj;
    };

    Widget.prototype.enable = function() {
      var widgetObj;
      widgetObj = this;
      widgetObj.opts.disabled = false;
      widgetObj.jqObj.removeClass('uiWidgetDisalbed');
      return widgetObj;
    };

    Widget.prototype.destroy = function(revert) {
      var opts, self, widgetObj;
      widgetObj = this;
      self = widgetObj.jqObj;
      opts = widgetObj.opts;
      self.find('.uiWidget').each(function() {
        var key, obj, widget;
        obj = $(this);
        key = obj.attr('widget');
        widget = widgetObj.widget(key);
        if (widget != null) widgetDestroy(widget, revert);
        return true;
      });
      widgetDestroy(widgetObj(revert));
      return widgetObj;
    };

    return Widget;

  })();

  widgetDestroy = function(widget, revert) {
    var opts, self, widgetKey;
    self = widget.jqObj;
    opts = widget.opts;
    if (!(self.hasClass('uiWidget'))) self = opts.targetWidget;
    if (self.hasClass('uiDraggable') || self.find('.uiDraggable').length !== 0) {
      self.draggable('destroy');
    }
    if (self.find('.uiResizable').length !== 0) self.resizable('destroy');
    if ($.isFunction(widget.beforeDestroy)) widget.beforeDestroy();
    widgetKey = self.removeClass('uiWidget').attr('widget');
    widget.removeWidget(widgetKey);
    if (revert) opts.clone.insertAfter(self);
    self.remove();
    delete opts.clone;
    return opts = null;
  };

}).call(this);
(function() {
  var $, $$, setPosByObject, setPosByStr;

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.moveToPos = function(options) {
    var positionObj, self;
    self = this;
    positionObj = new $$.Position(self);
    positionObj.moveToPos(options);
    return self;
  };

  $$.Position = (function() {

    Position.name = 'Position';

    function Position(self, options) {
      var defaults, positionObj;
      positionObj = this;
      if (!(positionObj instanceof $$.Position)) {
        return new $$.Position(self, options);
      }
      positionObj.opts = {};
      defaults = {
        returnOldPos: false,
        oldPos: null
      };
      $.extend(positionObj.opts, defaults, options);
      positionObj.jqObj = self;
    }

    Position.prototype.moveToPos = function(position) {
      var oldPos, opts, positionObj, returnValue, self;
      positionObj = this;
      self = positionObj.jqObj;
      opts = positionObj.opts;
      oldPos = {
        position: null,
        left: null,
        top: null,
        right: null,
        bottom: null
      };
      self.css('margin', 0);
      if (opts.returnOldPos) {
        $.each(oldPos, function(key) {
          return oldPos[key] = self.css(key);
        });
        returnValue = oldPos;
      } else {
        returnValue = positionObj;
      }
      if (position === void 0) position = opts.position;
      if (typeof position === 'string') {
        setPosByStr(self, position);
      } else if ($.isPlainObject(position)) {
        setPosByObject(self, position);
      }
      return returnValue;
    };

    return Position;

  })();

  setPosByStr = function(self, posStr) {
    var parentHeight, parentObj, parentOffset, parentWidth, posSetting, propFunc, targetHeight, targetWidth, windowHeight, windowObj, windowWidth;
    windowObj = $(window);
    parentObj = self.parent();
    propFunc = $.prop ? 'prop' : 'attr';
    if ((parentObj[propFunc]('tagName')).toUpperCase() === 'BODY') {
      parentObj = windowObj;
    }
    windowWidth = windowObj.width();
    windowHeight = windowObj.height();
    parentWidth = parentObj.width();
    parentHeight = parentObj.height();
    targetWidth = self.outerWidth();
    targetHeight = self.outerHeight();
    posSetting = {
      position: 'absolute',
      left: null,
      top: null,
      right: null,
      bottom: null
    };
    parentOffset = self.parent().offset();
    if ((self.css('position')) === 'fixed') posSetting.position = 'fixed';
    switch (posStr.toLowerCase()) {
      case 'center':
        parentWidth = Math.max(Math.min(parentWidth, windowWidth), targetWidth);
        parentHeight = Math.max(Math.min(parentHeight, windowHeight), targetHeight);
        posSetting['left'] = parentOffset.left + (parentWidth - targetWidth) / 2;
        posSetting["top"] = parentOffset.top + (parentHeight - targetHeight) / 2 + ($(document)).scrollTop();
        break;
      case 'leftbottom':
        posSetting["left"] = posSetting["bottom"] = 0;
        break;
      case 'lefttop':
        posSetting["left"] = posSetting["top"] = 0;
        break;
      case 'righttop':
        posSetting["right"] = posSetting["top"] = 0;
        break;
      case 'rightbottom':
        posSetting["right"] = posSetting["bottom"] = 0;
        break;
      default:
        posSetting[posStr] = 0;
    }
    self.css(posSetting);
    return null;
  };

  setPosByObject = function(self, pos) {
    var posSetting;
    posSetting = {
      position: 'absolute',
      left: null,
      top: null,
      right: null,
      bottom: null
    };
    $.extend(posSetting, pos);
    if (self.css('position' === 'fixed')) posSetting.position = "fixed";
    self.css(posSetting);
    return null;
  };

}).call(this);
(function() {
  var $, $$, Interaction, checkArea, complete, setInteractionMask, setInteractionSetting,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  Interaction = (function() {

    Interaction.name = 'Interaction';

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

    Interaction.prototype.init = function() {
      var interactionObj, mouseDownEvent, mouseMoveEvent, mouseUpEvent, obj, opts, self;
      interactionObj = this;
      self = interactionObj.jqObj;
      opts = interactionObj.opts;
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
      obj.on(mouseDownEvent, function(e) {
        setInteractionSetting(self, opts, e);
        if (opts.type === 'resize') return false;
        return !opts.stopMouseDownPropagation;
      });
      mouseMoveEvent = "mousemove." + opts.widgetKey;
      mouseUpEvent = "mouseup." + opts.widgetKey;
      $(document).on(mouseMoveEvent, function(e) {
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
            maskItem.width(newWidth).height(newHeight);
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
      $(document).on(mouseUpEvent, function() {
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
    if ((opts.event.start(self)) === false || $(e.target).hasClass('uiUserBtn')) {
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

  $.fn.draggable = function(options) {
    var draggableObj, self;
    self = this;
    draggableObj = new $$.Draggable(self, options);
    return draggableObj.init(self, draggableObj.opts);
  };

  $$.Draggable = (function(_super) {

    __extends(Draggable, _super);

    Draggable.name = 'Draggable';

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

  $.fn.resizable = function(options) {
    var resizableObj, self;
    self = this;
    resizableObj = new $$.Resizable(self, options);
    return resizableObj.init(self, resizableObj.opts);
  };

  $$.Resizable = (function(_super) {

    __extends(Resizable, _super);

    Resizable.name = 'Resizable';

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
          if ((opts.resizeStop(self)) === false) return false;
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
(function() {
  var $, $$, changeButtonStatus, getOriginClass, initButtonSet, initEvent, removeStatusClass, setOriginClass, setStatusClass,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.buttonSet = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.ButtonSet);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.ButtonSet = (function(_super) {

    __extends(ButtonSet, _super);

    ButtonSet.name = 'ButtonSet';

    function ButtonSet(self, options) {
      var buttonSetObj, defaults, opts;
      buttonSetObj = this;
      if (!(buttonSetObj instanceof $$.ButtonSet)) {
        return new $$.ButtonSet(self, options);
      }
      defaults = {
        buttonSetClass: "" + $$.defaultBoxShadow + " uiCornerAll",
        buttonSetType: '',
        buttonSetGroup: '',
        buttonClass: $$.defaultGradientBG,
        buttonSetBorderClass: $$.defaultBorder,
        buttonBorderClass: 'uiGreyBorder',
        buttonHoverClass: $$.hoverGradientBG,
        buttonSelectedClass: "" + $$.selectedGradientBG + " uiActive",
        buttonPressClass: "" + $$.hoverGradientBG + " uiButtonPressed",
        buttonWidth: 0,
        buttonMargin: 0,
        iconArray: null,
        iconFloatArray: null,
        defaultSelectedItem: -1,
        vertical: false,
        statusClass: '',
        imgIconHTML: '<div class="uiIcon uiUncheckedButtonIcon"></div>',
        click: $.noop
      };
      opts = $.extend(defaults, options);
      buttonSetObj.constructor.__super__.constructor.call(buttonSetObj, self, opts);
      buttonSetObj.init();
    }

    ButtonSet.prototype.init = function() {
      var buttonSetObj;
      buttonSetObj = this;
      buttonSetObj.createWidget();
      initButtonSet(buttonSetObj.jqObj, buttonSetObj.opts);
      return buttonSetObj;
    };

    ButtonSet.prototype.clickButton = function(index) {
      var buttonSetObj, obj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      obj = self.children().eq(index).click();
      return buttonSetObj;
    };

    ButtonSet.prototype.button = function(index) {
      var buttonSetObj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      return self.children().eq(index);
    };

    ButtonSet.prototype.buttonText = function(index, text) {
      var buttonSetObj, iconObj, obj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      obj = self.children().eq(index);
      if (arguments.length !== 2) return obj.text();
      iconObj = obj.children('.uiIcon');
      obj.html(text).prepend(iconObj);
      return buttonSetObj;
    };

    ButtonSet.prototype.buttonIcon = function(index, icon) {
      var buttonSetObj, iconArrayTotal, iconClass, obj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      if (!$.isArray(opts.iconArray)) return '';
      obj = self.children().eq(index);
      iconArrayTotal = opts.iconArray.length - 1;
      if (index > iconArrayTotal) index = iconArrayTotal;
      iconClass = opts.iconArray[index];
      if (arguments.length < 2) return iconClass;
      obj.children('.uiIcon').removeClass(iconClass).addClass(icon);
      opts.iconArray[index] = icon;
      return buttonSetObj;
    };

    ButtonSet.prototype.val = function(index, checked) {
      var buttonSetObj, hasStatus, obj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      obj = self.children().eq(index);
      hasStatus = false;
      $.each('uiCheckBox uiRadio uiImgRadio uiImgCheckBox'.split(' '), function(n, value) {
        if (obj.hasClass(value)) {
          hasStatus = true;
          return false;
        }
      });
      if (!hasStatus) return false;
      if (arguments.length < 2) {
        if (obj.hasClass(opts.buttonSelectedClass)) return true;
        return false;
      }
      if (checked === true) {
        if (!obj.hasClass(opts.buttonSelectedClass)) {
          obj.trigger('click.uiButtonSet');
        }
      } else {
        if (obj.hasClass(opts.buttonSelectedClass)) {
          obj.removeClass(opts.buttonSelectedClass).addClass(opts.buttonClass);
        }
      }
      return buttonSetObj;
    };

    ButtonSet.prototype.removeButton = function(index) {
      var buttonSetObj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      if ($.isArray(opts.iconArray)) opts.iconArray.splice(index, 1);
      return self.children('.uiButton').eq(index).remove();
    };

    return ButtonSet;

  })($$.Widget);

  initButtonSet = function(self, opts) {
    var buttonTypeClass, groupStr;
    opts.statusClass = {};
    groupStr = '';
    switch (opts.buttonSetType) {
      case 'radio':
        buttonTypeClass = 'uiRadio';
        groupStr = $$.getRandomKey(5);
        break;
      case 'checkBox':
        buttonTypeClass = 'uiCheckBox';
        break;
      case 'imageRadio':
        buttonTypeClass = 'uiImgRadio';
        groupStr = $$.getRandomKey(5);
        break;
      case 'imageCheckBox':
        buttonTypeClass = 'uiImgCheckBox';
        break;
      default:
        buttonTypeClass = '';
    }
    self.addClass('uiButtonSet uiWidget uiNoSelectText').children().each(function(n) {
      var buttonClass, floatClass, index, marginAttr, obj;
      obj = $(this).addClass(buttonTypeClass);
      if (groupStr.length !== 0) obj.attr('group', groupStr);
      if (opts.buttonMargin > 0) {
        buttonClass = "uiButton uiCornerAll " + opts.buttonClass + " " + opts.buttonBorderClass;
      } else {
        buttonClass = "uiButton " + opts.buttonClass;
      }
      if (obj.hasClass('uiImgRadio' || obj.hasClass('uiImgCheckBox'))) {
        obj.wrapInner('<span />').prepend(opts.imgIconHTML);
      }
      if (n !== 0) {
        if (opts.buttonMargin > 0) {
          marginAttr;

          if (opts.vertical === true) {
            marginAttr = 'marginTop';
          } else {
            marginAttr = 'marginLeft';
          }
          obj.css(marginAttr, opts.buttonMargin);
        } else {
          if (opts.vertical === true) {
            buttonClass += " uiBorderTop " + opts.buttonBorderClass;
          } else {
            buttonClass += " uiBorderLeft " + opts.buttonBorderClass;
          }
        }
      }
      obj.addClass(buttonClass);
      if ($.isArray(opts.iconArray)) {
        index = n;
        floatClass = '';
        if (index >= opts.iconArray.length) index = opts.iconArray.length - 1;
        if ($.isArray(opts.iconFloatArray)) {
          if (n >= opts.iconFloatArray.length) {
            floatClass = opts.iconFloatArray[opts.iconFloatArray.length - 1];
          } else {
            floatClass = opts.iconFloatArray[n];
          }
          obj.wrapInner('<span />');
          if (floatClass === 'right') {
            floatClass = 'uiIconFloatRight';
          } else {
            floatClass = '';
          }
        }
        obj.wrapInner('<span />').prepend("<span class=\"uiIcon " + opts.iconArray[index] + " " + floatClass + "\"></span>");
      }
      if (opts.buttonWidth !== 0) return obj.width(opts.buttonWidth);
    });
    if (opts.buttonMargin === 0) {
      self.addClass("" + opts.buttonSetClass + " " + opts.buttonSetBorderClass);
    }
    if (opts.vertical) self.width(self.children().outerWidth(true));
    initEvent(self, opts);
    if (opts.defaultSelectedItem > -1) {
      changeButtonStatus(self.children().eq(opts.defaultSelectedItem), opts);
    }
    return null;
  };

  initEvent = function(self, opts) {
    var mouseDownFlag;
    mouseDownFlag = false;
    self.children('.uiButton, .uiImgButton').on('mouseenter.uiButtonSet mouseleave.uiButtonSet mousedown.uiButtonSet mouseup.uiButtonSet click.uiButtonSet', function(e) {
      var obj;
      obj = $(this);
      if (e.type === 'click') {
        if ((opts.click(self, obj, e)) === false) return;
        changeButtonStatus(obj, opts);
      }
      switch (e.type) {
        case 'mouseenter':
          return setStatusClass(obj, opts, opts.buttonHoverClass);
        case 'mouseleave':
          return removeStatusClass(obj, opts, opts.buttonHoverClass);
        case 'mousedown':
          return setStatusClass(obj, opts, opts.buttonPressClass);
        case 'mouseup':
          return removeStatusClass(obj, opts, opts.buttonPressClass);
      }
    });
    return null;
  };

  changeButtonStatus = function(obj, opts) {
    var group, siblingsObj;
    if (obj.hasClass('uiRadio') || obj.hasClass('uiImgRadio')) {
      group = obj.attr('group');
      siblingsObj = obj.siblings("[group=\"" + group + "\"]");
      obj.removeClass("" + opts.buttonHoverClass + " " + opts.buttonClass).addClass(opts.buttonSelectedClass);
      siblingsObj.removeClass(opts.buttonSelectedClass).addClass(opts.buttonClass);
      if (obj.hasClass('uiImgRadio')) {
        obj.addClass('uiImgRadioChecked').children('.uiIcon').removeClass('uiUnCheckedButtonIcon').addClass('uiCheckedButtonIcon');
        siblingsObj.removeClass('uiImgRadioChecked').children('.uiIcon').removeClass('uiCheckedButtonIcon').addClass('uiUnCheckedButtonIcon');
      }
    } else if (obj.hasClass('uiCheckBox') || obj.hasClass('uiImgCheckBox')) {
      if (opts.statusClass[opts.buttonHoverClass] === null) {
        obj.toggleClass(opts.buttonSelectedClass).toggleClass(opts.buttonClass);
      } else if (opts.statusClass[opts.buttonHoverClass] !== opts.buttonSelectedClass) {
        obj.removeClass(opts.buttonHoverClass).addClass(opts.buttonSelectedClass);
      } else {
        obj.removeClass(opts.buttonHoverClass).addClass(opts.buttonClass);
      }
      if (obj.hasClass('uiImgCheckBox')) {
        obj.toggleClass('uiImgCheckBoxChecked').children('.uiIcon').toggleClass('uiCheckedButtonIcon uiUnCheckedButtonIcon');
      }
    } else {
      obj.removeClass(opts.buttonHoverClass).addClass(opts.buttonClass);
    }
    return $.each(opts.statusClass, function(key, value) {
      return opts.statusClass[key] = null;
    });
  };

  setOriginClass = function(obj, opts, statusClass) {
    return $.each([opts.buttonClass, opts.buttonSelectedClass, opts.buttonHoverClass, opts.buttonPressClass], function(n, value) {
      if (obj.hasClass(value)) opts.statusClass[statusClass] = value;
      return obj.removeClass(value);
    });
  };

  getOriginClass = function(obj, opts, statusClass) {
    if (opts.statusClass[statusClass] === null) return;
    $.each([opts.buttonClass, opts.buttonSelectedClass, opts.buttonHoverClass, opts.buttonPressClass], function(n, value) {
      return obj.removeClass(value);
    });
    return obj.addClass(opts.statusClass[statusClass]);
  };

  setStatusClass = function(obj, opts, statusClass) {
    setOriginClass(obj, opts, statusClass);
    return obj.addClass(statusClass);
  };

  removeStatusClass = function(obj, opts, statusClass) {
    return getOriginClass(obj, opts, statusClass);
  };

}).call(this);
(function() {
  var $, $$, checkItemViewStatus, initEvent, initTabs,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.tabs = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Tabs);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Tabs = (function(_super) {

    __extends(Tabs, _super);

    Tabs.name = 'Tabs';

    function Tabs(self, options) {
      var defaults, opts, tabsObj;
      tabsObj = this;
      if (!(tabsObj instanceof $$.Tabs)) return new $$.Tabs(self, options);
      defaults = {
        tabsClass: "" + $$.defaultBorder + " uiCornerAll " + $$.defaultBoxShadow,
        titleBarClass: $$.defaultGradientBG,
        tabsItemWidth: -1,
        tabsItemMargin: -1,
        closableArray: "all",
        activateIndex: 0,
        tabsItemHoverClass: $$.hoverGradientBG,
        tabsItemSelectedClass: "selected",
        titleList: null,
        change: $.noop,
        close: $.noop,
        leftClick: $.noop,
        rightClick: $.noop,
        tabsItemTotal: 0,
        tabsItemOuterWidth: 0,
        tabsItemViewTotal: 0,
        tabsItemViewIndex: 0,
        titleBarHTML: '<div class="uiTitleBar uiTabsList uiNoSelectText"><div class="uiListContent"><div class="uiTabsItemContainer"></div></div></div>',
        tabsItemHTML: '<div class="uiTabsItem uiCornerTop"></div>',
        contentHTML: '<div class="uiContent"></div>',
        controlHTML: '<div class="uiLeftArrow uiSmallIcon uiArrowLeftIcon"></div><div class="uiRightArrow uiSmallIcon uiArrowRightIcon""></div>',
        closeHTML: '<div class="uiCloseItemBtn uiSmallIcon uiSmallcloseButtonIcon"></div>'
      };
      opts = $.extend(defaults, options);
      tabsObj.constructor.__super__.constructor.call(tabsObj, self, opts);
      tabsObj.init();
    }

    Tabs.prototype.init = function() {
      var tabsObj;
      tabsObj = this;
      tabsObj.createWidget();
      initTabs(tabsObj.jqObj, tabsObj.opts);
      return tabsObj;
    };

    Tabs.prototype.addItem = function(content, title, index) {
      var contentObj, contentTarget, insertFunc, itemTarget, opts, self, tabsObj;
      tabsObj = this;
      self = tabsObj.jqObj;
      opts = tabsObj.opts;
      contentObj = this(content);
      if (title == null) title = contentObj.attr('title');
      if (isNaN(parseInt(index))) {
        itemTarget = $('> .uiTabsList > .uiListContent > .uiTabsItemContainer', self);
        contentTarget = self;
        insertFunc = 'appendTo';
      } else {
        itemTarget = ($('> .uiTabsList > .uiListContent > .uiTabsItemContainer > .uiTabsItem', self)).eq(index);
        contentTarget = (self.childdren('.uiTabsContent')).eq(index);
        insertFunc = 'insertBefore';
      }
      $(opts.tabsItemHTML).html(title + opts.closeHTML)[insertFunc](itemTarget);
      $(opts.contentHTML).addClass('uiTabsContent uiHidden').append(contentObj)[insertFunc](itemTarget);
      opts.tabsItemTotal++;
      return tabsObj;
    };

    Tabs.prototype.activate = function(index) {
      var opts, self, tabsObj;
      tabsObj = this;
      self = tabsObj.jqObj;
      opts = tabsObj.opts;
      if (arguments.length === 0) return opts.activateIndex;
      $('>.uiTitleBar >.uiListContent .uiTabsItem', self).eq(index).trigger('click.uiTabs');
      return tabsObj;
    };

    Tabs.prototype.item = function(index, content, title) {
      var item, opts, self, tabsObj, titleBar;
      tabsObj = this;
      self = tabsObj.jqObj;
      opts = tabsObj.opts;
      if (index == null) index = 0;
      item = $('>.uiTabsContent', self).eq(index);
      titleBar = $('> .uiTabsList > .uiListContent > .uiTabsItemContainer >.uiTabsItem', self).eq(index);
      if (typeof content === 'undefined') return item;
      if (content != null) item.html(content);
      if (typeof title === 'undefined') return titleBar;
      titleBar.html(title);
      return tabsObj;
    };

    return Tabs;

  })($$.Widget);

  initTabs = function(self, opts) {
    var contentObj, selfHeight, tabsItemList, titleBarHeight, titleBarObj;
    titleBarObj = $(opts.titleBarHTML).addClass(opts.titleBarClass).append(opts.controlHTML);
    self.addClas("uiTabs uiWidget " + opts.tabsClass).children().each(function(n) {
      var closeHTML, contentObj, title;
      closeHTML = '';
      if (opts.closableArray === 'all' || (($.isArray(opts.closableArray)) && ($.inArray(n, opts.closableArray)) !== -1)) {
        closeHTML = opts.closeHTML;
      }
      contentObj = ($(this)).addClass('uiTabsContent uiHidden');
      if ($.isArray(opts.titleList)) title = opts.titleList[n];
      if (title == null) title = content.attr('title');
      $(opts.tabsItemHTML).html(title + closeHTML).appendTo($('>.uiListContent >.uiTabsItemContainer', titleBarObj));
      return opts.tabsItemTotal++;
    });
    self.prepend(titleBarObj);
    tabsItemList = $('> .uiTabsList > .uiListContent .uiTabsItem', self);
    if (opts.tabsItemWidth > 0) tabsItemList.width(opts.tabsItemWidth);
    if (opts.tabsItemMargin > -1) {
      tabsItemList.css('marginLeft', opts.tabsItemMargin);
    }
    opts.tabsItemOuterWidth = tabsItemList.outerWidth(true);
    opts.tabsItemViewTotal = Math.floor(($('>.uiTabsList', self)).width() / opts.tabsItemOuterWidth);
    if (opts.tabsItemTotal > opts.tabsItemViewTotal) {
      $('> .uiTitleBar > .uiRightArrow', self).show();
    }
    selfHeight = self.height();
    titleBarHeight = titleBarObj.height();
    if (selfHeight > titleBarHeight) {
      contentObj = self.children('.uiTabsContent');
      contentObj.height(selfHeight - titleBarHeight - (parseInt(contentObj.css('marginTop'))) - (parseInt(contentObj.css('marginBotto'))));
    }
    return initEvent(self, opts);
  };

  initEvent = function(self, opts) {
    $('> .uiTabsList > .uiListContent > .uiTabsItemContainer', self).on('click.uiTabs', function(e) {
      var content, index, nextObj, obj, target;
      target = $(e.target);
      if (target.hasClass('uiCloseItemBtn')) {
        obj = target.parent('.uiTabsItem');
        if ((opts.close(self, obj, e)) === false) return false;
        nextObj = obj.next();
        if (nextObj.length !== 0) {
          nextObj.click();
        } else {
          obj.prev().click();
        }
        index = obj.index();
        self.children('.uiTabsContent').eq(index).remove();
        obj.remove();
        opts.tabsItemTotal--;
        checkItemViewStatus(self, opts);
        return false;
      } else if (target.hasClass('uiTabsItem')) {
        index = target.addClass(opts.tabsItemSelectedClass).siblings('.selected').removeClass(opts.tabsItemSelectedClass).end().index();
        content = (self.children('.uiTabsContent')).eq(index);
        if ((opts.change(self, target, content, e)) === false) return false;
        content.removeClass('uiHidden').siblings('.uiTabsContent').addClass('uiHidden');
        return opts.activateIndex = index;
      }
    });
    $('>.uiTitleBar', self).on('click.uiTabs', function(e) {
      var clickFunc, scrollLeftValue, target;
      target = $(e.target);
      if (target.hasClass('uiRightArrow')) {
        clickFunc = 'rightClick';
        opts.tabsItemViewIndex++;
      } else if (target.hasClass('uiLeftArrow')) {
        clickFunc = 'leftClick';
        opts.tabsItemViewIndex--;
      }
      if (opts.tabsItemViewIndex < 0) {
        opts.tabsItemViewIndex = 0;
        return;
      } else if (opts.tabsItemTotal - opts.tabsItemViewTotal < opts.tabsItemViewIndex) {
        opts.tabsItemViewIndex = opts.tabsItemTotal - opts.tabsItemViewTotal;
        return;
      }
      if (clickFunc != null) {
        if ((opts[clickFunc](self, target, e)) === false) return false;
        scrollLeftValue = opts.tabsItemOuterWidth * opts.tabsItemViewIndex;
        target.siblings('.uiListContent').stop().animate({
          left: -scrollLeftValue
        }, opts.animateTime);
        return checkItemViewStatus(self, opts);
      }
    });
    $('>.uiTabsList', self).on('mousewheel.uiTabs', function(e, delta) {
      if (delta > 0) {
        $('>.uiLeftArrow', this).click();
      } else {
        $('>.uiRightArrow', this).click();
      }
      return false;
    });
    return $('> .uiTabsList > .uiListContent > .uiTabsItemContainer > .uiTabsItem', self).hover(function() {
      return $(this).addClass(opts.tabsItemHoverClass);
    }, function() {
      return $(this).removeClass(opts.tabsItemHoverClass);
    });
  };

  checkItemViewStatus = function(self, opts) {
    var arrowLeftObj, arrowRightObj;
    arrowRightObj = $('> .uiTitleBar > .uiRightArrow', self);
    arrowLeftObj = $('> .uiTitleBar > .uiLeftArrow', self);
    if (opts.tabsItemTotal - opts.tabsItemViewTotal <= opts.tabsItemViewIndex) {
      arrowRightObj.hide();
    } else {
      arrowRightObj.show();
    }
    if (opts.tabsItemViewIndex <= 0) {
      return arrowLeftObj.hide();
    } else {
      return arrowLeftObj.show();
    }
  };

}).call(this);
(function() {
  var $, $$, initEvent, initSlide, setSlide,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.slide = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Slide);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Slide = (function(_super) {

    __extends(Slide, _super);

    Slide.name = 'Slide';

    function Slide(self, options) {
      var defaults, opts, slideObj;
      slideObj = this;
      if (!(slideObj instanceof $$.Slide)) return new $$.Slide(self, options);
      defaults = {
        mode: 'horizontal',
        slideClass: "" + $$.defaultGradientBG + " uiCornerAll " + $$.defaultBorder,
        sliderCrossClass: $$.hoverGradientBG,
        slideClassVerticalMode: "uiBlackGradientBG uiBlackBorder uiCornerAll",
        sliderCrossClassVerticalMode: "uiBlueGradientBG",
        sliderClass: "uiBlackBorder uiDefaultSliderBG uiCornerAll",
        sliderLength: 8,
        sliderTop: -5,
        sliderLeft: -5,
        noUserEvent: false,
        userImageSlider: false,
        min: 0,
        max: 100,
        step: 0.2,
        animation: true,
        click: $.noop,
        slide: $.noop,
        slideLength: 0,
        slideValue: 0,
        slideMax: 0,
        slideBegin: 0,
        panelHTML: '<div class="uiPanel"></div>',
        sliderCrossHTML: '<div class="uiSliderCross"></div>',
        sliderHTML: '<div class="uiSlider"></div>',
        slideDrag: false
      };
      opts = $.extend(defaults, options);
      slideObj.constructor.__super__.constructor.call(slideObj, self, opts);
      slideObj.init();
    }

    Slide.prototype.init = function() {
      var slideObj;
      slideObj = this;
      slideObj.createWidget();
      initSlide(slideObj.jqObj, slideObj.opts);
      return slideObj;
    };

    Slide.prototype.val = function(value, animate) {
      var opts, self, slideObj;
      slideObj = this;
      self = slideObj.jqObj;
      opts = slideObj.opts;
      if (arguments.length === 0) return opts.slideValue;
      if (arguments.length === 1) animate = true;
      if (!opts.slideDrag) return setSlide(self, opts, value, animate, true);
    };

    Slide.prototype.beforeDestroy = function() {
      var opts, self, slideObj;
      slideObj = this;
      self = slideObj.jqObj;
      opts = slideObj.opts;
      return $(docuemnt).off("." + opts.widgetKey);
    };

    return Slide;

  })($$.Widget);

  initSlide = function(self, opts) {
    var slider, sliderCross;
    if (opts.mode === 'vertical') {
      opts.slideClass = opts.slideClassVerticalMode;
      opts.sliderCrossClass = opts.sliderCrossClassVerticalMode;
    }
    slider = $(opts.sliderHTML);
    sliderCross = $(opts.sliderCrossHTML).addClass(opts.sliderCrossClass);
    if (opts.userImageSlider) {
      slider.addClass('uiImageSlider uiIcon uiCicleIcon');
    } else {
      slider.addClass(opts.sliderClass);
    }
    self.addClass("uiSlide uiWidget uiNoSelectText " + opts.slideClass).append($(opts.panelHTML).append(sliderCross).append(slider));
    if (opts.userImageSlider) opts.sliderLength = slider.width();
    if (opts.mode === 'vertical') {
      opts.slideBegin = opts.sliderTop = self.offset().top;
      slider.css('left', opts.sliderLeft - 1);
      sliderCross.width('100%');
      if (!opts.userImageSlider) {
        slider.width(self.width() - 2 * opts.sliderLeft).height(opts.sliderLength);
      } else {
        slider.css('top', -(opts.sliderLength >> 2));
      }
    } else {
      opts.slideBegin = opts.sliderLeft = self.offset().left;
      slider.css('top', opts.sliderTop - 1);
      sliderCross.height('100%');
      if (!opts.userImageSlider) {
        slider.height(self.height() - 2 * opts.sliderTop).width(opts.sliderLength);
      } else {
        self.css('left', -(opts.sliderLength >> 2));
      }
      opts.slideLength = self.width();
    }
    opts.slideMax = opts.slideLength;
    if (!opts.userImageSlider) opts.slideMax -= opts.sliderLength - 2;
    if (!opts.noUserEvent) initEvent(self, opts);
    if (opts.slideValue !== 0) return setSlide(self, opts, opts.slideValue);
  };

  initEvent = function(self, opts) {
    var documentObj, mouseMoveEvent, mouseUpEvent, panelObj;
    documentObj = $(document);
    panelObj = $('>.uiPanel', self);
    panelObj.on('click.uiSlide', function(e) {
      var beginValue, percent;
      if ($(e.target).hasClass('uiSlider')) return false;
      if ((opts.click(self, $(this, e))) === false) return false;
      if (opts.mode === 'vertical') {
        beginValue = e.clientY + documentObj.scrollTop() + self.parent().scrollTop();
      } else {
        beginValue = e.clientX + documentObj.scrollLeft() + self.parent().scrollLeft();
      }
      percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax;
      return setSlide(self, opts, Math.floor(percent * (opts.max - opts.min) + opts.min), opts.animation);
    });
    panelObj.on('mousewheel.uiSlide', function(e, delta) {
      var percent, positionStr;
      positionStr = 'left';
      if (opts.mode === 'vertical') positionStr = 'top';
      percent = (parseInt($('>.uiSlider', this).css(positionStr))) / opts.slideMax;
      setSlide(self, opts, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
      return false;
    });
    $('>.uiSlider', panelObj).on('mousedown.uiSlide', function(e) {
      return opts.slideDrag = true;
    });
    mouseMoveEvent = "mousemove." + opts.widgetKey;
    mouseUpEvent = "mouseup." + opts.widgetKey;
    return documentObj.on({
      mouseMoveEvent: function(e) {
        var beginValue, percent;
        if (opts.slideDrag) {
          if (opts.mode === 'vertical') {
            beginValue = e.clientY + documentObj.scrollTop() + self.parent().scrollTop();
          } else {
            beginValue = e.clientX + documentObj.scrollLeft() + self.parent().scrollLeft();
          }
          percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax;
          return setSlide(self, opts, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
        }
      },
      mouseUpEvent: function(e) {
        return opts.slideDrag = false;
      }
    });
  };

  setSlide = function(self, opts, value, animate, jumpToEnd) {
    var obj, percent, props, sliderCross, sliderCrossProps, sliderCrossValue;
    obj = $('>.uiPanel >.uiSlider', self);
    if (value == null) value = 0;
    value = value > opts.max ? opts.max : (value < 0 ? 0 : value);
    opts.slideValue = value;
    percent = (value - opts.min) / (opts.max - opts.min);
    value = opts.slideMax * percent;
    if (opts.userImageSlider && value === 0) value = -(opts.sliderLength >> 2);
    sliderCross = $('>.uiPanel >.uiSliderCross', self);
    sliderCrossValue = value + 2;
    if (opts.mode === 'vertical') {
      props = {
        top: value
      };
      sliderCrossProps = {
        height: sliderCrossValue
      };
    } else {
      props = {
        left: value
      };
      sliderCrossProps = {
        width: sliderCrossValue
      };
    }
    if (animate) {
      obj.stop(true, jumpToEnd).animate(props, opts.animateTime, function() {
        return opts.slide(self, obj, opts.slideValue);
      });
      return sliderCross.stop(true, jumpToEnd).animate(sliderCrossProps, opts.animateTime);
    } else {
      obj.css(props);
      sliderCross.css(sliderCrossProps);
      return opts.slide(self, obj, opts.slideValue);
    }
  };

}).call(this);
(function() {
  var $, $$, initAccordion, initEvent, setContentHeight,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.accordion = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Accordion);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Accordion = (function(_super) {

    __extends(Accordion, _super);

    Accordion.name = 'Accordion';

    function Accordion(self, options) {
      var accordionObj, defaults, opts;
      accordionObj = this;
      if (!(accordionObj instanceof $$.Accordion)) {
        return new $$.Accordion(self, options);
      }
      defaults = {
        accordionClass: "" + $$.defaultBorder + " uiCornerAll " + $$.defaultBoxShadow,
        titleBarClass: $$.defaultGradientBG,
        activeClass: $$.defaultGradientBG,
        itemTitleBarClass: 'uiBlackGradientBG',
        active: [0],
        event: 'click',
        titleIcon: null,
        animation: 'toggle',
        title: null,
        itemTitleList: null,
        height: "auto",
        toggle: false,
        hideOthers: true,
        animating: false,
        titleBarHTML: '<div class="uiAccordionTitleBar uiNoSelectText"><span class="title"></span></div>',
        itemTitleBarHTML: '<div class="uiTitleBar uiNoSelectText"><span class="uiUserBtn uiSmallIcon uiArrowDownIcon"></span><span class="uiTitle"></span></div>',
        changeStart: $.noop,
        change: $.noop
      };
      opts = $.extend(defaults, options);
      accordionObj.constructor.__super__.constructor.call(accordionObj, self, opts);
      accordionObj.init();
    }

    Accordion.prototype.init = function() {
      var accordionObj;
      accordionObj = this;
      accordionObj.createWidget();
      initAccordion(accordionObj.jqObj, accordionObj.opts);
      return accordionObj;
    };

    Accordion.prototype.activate = function(index) {
      var accordionObj, activateArr, obj, opts, self, titleBarList;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      if (arguments.length === 0) {
        activateArr = [];
        titleBarList = $('> .uiTitleBar', self);
        titleBarList.each(function(n) {
          if ($(this).hasClass(opts.activeClass)) return activateArr.push(n);
        });
        return activateArr;
      }
      obj = $('> .uiTitleBar', self).eq(index);
      if (!obj.hasClass(opts.activeClass)) obj.trigger(opts.event);
      return accordionObj;
    };

    Accordion.prototype.item = function(index, content, title) {
      var accordionObj, contentObj, opts, self, titleBarObj;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      if (index == null) index = 0;
      titleBarObj = $('> .uiTitleBar', self).eq(index);
      contentObj = titleBarObj.next();
      if (arguments.length === 1) return contentObj;
      if (arguments.length === 2) {
        if (content != null) {
          contentObj.html(content);
          return accordionObj;
        }
        return titleBarObj;
      }
      titleBarObj.children('.uiTitle').html(title);
      if (content != null) contentObj.html(content);
      return accordionObj;
    };

    Accordion.prototype.addItem = function(item, title, index) {
      var accordionObj, itemObj, obj, opts, self, titleBarObj;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      itemObj = $(item);
      if (title == null) title = itemObj.attr('title');
      titleBarObj = $(opts.itemTitleBarHTML).addClass(opts.itemTitleBarClass).children('.uiTitle').html(title).end();
      itemObj.addClass('uiContent uiHidden').height(opts.height);
      if (arguments.length === 2) {
        obj = $('> .uiTitleBar', self).eq(index);
        titleBarObj.insertBefore(obj);
        itemObj.insertBefore(obj);
      } else {
        self.append(titleBarObj).append(itemObj);
      }
      return accordionObj;
    };

    Accordion.prototype.removeItem = function(index) {
      var accordionObj, opts, self;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      if (index == null) index = 0;
      return $('>.uiTitleBar', self).eq(index).next().andSelf().remove();
    };

    Accordion.prototype.title = function(title) {
      var accordionObj, obj, opts, self;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      obj = $('>.uiAccordionTitleBar > .title', self);
      if (arguments.length === 0) return obj.text();
      obj.text(title);
      return accordionObj;
    };

    Accordion.prototype.titleIcon = function(titleIcon) {
      var accordionObj, obj, opts, self;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      if (arguments.length === 0) return opts.titleIcon;
      if (opts.titleIcon === null) {
        $('>.uiAccordionTitleBar', self).prepend($('<span class="uiTitleIcon" />'));
      }
      obj = $('> .uiAccordionTitleBar > span.uiTitleIcon', self).removeClass(opts.titleIcon).addClass(titleIcon);
      opts.titleIcon = titleIcon;
      return accordionObj;
    };

    return Accordion;

  })($$.Widget);

  initAccordion = function(self, opts) {
    var title, titleBar;
    title = opts.title || self.attr('title');
    if (title != null) {
      titleBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).children('.title').html(title).end();
      if (opts.titleIcon != null) {
        titleBar.prepend($('<span class="uiTitleIcon" />')).addClass(opts.titleIcon);
      }
    }
    self.addClass("uiAccordion uiWidget " + opts.accordionClass).children('div').each(function(n) {
      var buttonClass, contentClass, itemTitleBarObj, obj, titleBarClass;
      contentClass = 'uiHidden';
      titleBarClass = opts.itemTitleBarClass;
      buttonClass = '';
      obj = $(this);
      if (opts.active === 'all' || ($.inArray(n, opts.active)) !== -1) {
        contentClass = '';
        titleBarClass = "" + opts.activeClass + " uiActive";
        buttonClass = 'uiArrowUpIcon uiArrowDownIcon';
      }
      title = null;
      if ($.isArray(opts.itemTitleList)) title = opts.itemTitleList[n];
      if (title == null) title = obj.attr('title');
      itemTitleBarObj = $(opts.itemTitleBarHTML).addClass(titleBarClass);
      itemTitleBarObj.children('.uiUserBtn').toggleClass(buttonClass).siblings('.uiTitle').html(title);
      return itemTitleBarObj.insertBefore(obj.addClass("uiContent " + contentClass).height(opts.height));
    });
    self.prepend(titleBar);
    return initEvent(self, opts);
  };

  initEvent = function(self, opts) {
    self.on("" + opts.event + ".uiAccordion", function(e) {
      var changeObjList, selectedList, target;
      if (opts.disabled || opts.animating) return;
      target = $(e.target);
      if (!target.hasClass('uiTitleBar')) {
        target = target.parent('.uiTitleBar');
        if (target.length === 0) return;
      }
      if (!opts.toggle) if (target.hasClass(opts.activeClass)) return;
      if ((opts.changeStart(self, target, e)) === false) return false;
      opts.animating = true;
      selectedList = opts.hideOthers === true ? $(">.uiTitleBar." + opts.activeClass, self).not(target).removeClass("" + opts.activeClass + " uiActive").addClass(opts.itemTitleBarClass) : null;
      changeObjList = target.toggleClass("" + opts.itemTitleBarClass + " " + opts.activeClass + " uiActive").add(selectedList);
      changeObjList.children('.uiUserBtn').toggleClass('uiArrowUpIcon uiArrowDownIcon');
      return changeObjList.next('.uiContent').stop(true, true)[opts.animation](opts.animateTime, function() {
        if ($(this).is(':visible')) opts.change(self, target, e);
        return opts.animating = false;
      });
    });
    return null;
  };

  setContentHeight = function(self, opts) {
    var completeLoad, content, contentHeight, imgList, imgTotal, otherItemHeightTotal, outerOffset;
    otherItemHeightTotal = 0;
    content = self.children('.uiContent');
    self.children().each(function() {
      var obj;
      obj = $(this);
      if (!obj.hasClass('uiContent' && !obj.hasClass('uiResizable'))) {
        return otherItemHeightTotal += ($(this)).outerHeight(true);
      }
    });
    contentHeight = content.outerheight(true);
    outerOffset = contentHeight - content.height();
    imgList = self.find('img');
    if (imgList.length !== 0) {
      imgTotal = imgList.length;
      completeLoad = 0;
      imgList.each(function() {
        if (this.complete) {
          completeLoad++;
          if (completeLoad === imgTotal) {
            return content.height(self.height() - otherItemHeightTotal - outerOffset);
          }
        } else {
          return $(this).load(function() {
            completeLoad++;
            if (completeLoad === imgTotal) {
              return content.height(self.height() - otherItemHeightTotal - outerOffset);
            }
          });
        }
      });
    } else {
      content.height(self.height() - otherItemHeightTotal - outerOffset);
    }
    return null;
  };

}).call(this);
(function() {
  var $, $$, initDropDownList, initEvent,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.dropDownList = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.DropDownList);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.DropDownList = (function(_super) {

    __extends(DropDownList, _super);

    DropDownList.name = 'DropDownList';

    function DropDownList(self, options) {
      var defaults, dropDownListObj, opts;
      dropDownListObj = this;
      if (!(dropDownListObj instanceof $$.DropDownList)) {
        return new $$.DropDownList(self, options);
      }
      defaults = {
        dropDownListClass: "" + $$.defaultGradientBG + "  uiCornerAll " + $$.defaultBorder,
        selectListClass: "" + $$.defaultGradientBG + " uiCornerAll uiBlackBorder uiBlackBoxShadow",
        pageSize: 5,
        showAll: false,
        multiple: false,
        dropListType: 'normal',
        searchTip: '查找/search',
        hasScrollBar: false,
        listItemHoverClass: $$.hoverGradientBG,
        divideChar: ";",
        click: $.noop,
        change: $.noop,
        input: $.noop,
        blur: $.noop,
        focus: $.noop,
        selectItemTotal: 0,
        listItemOuterHeight: 0,
        dropDownHTML: '<div class="uiDropDown">\
                      <div class="uiDropDownBtn uiSmallIcon uiDropdownButtonIcon uiBlackBorder"></div>\
                  </div>',
        selectListHTML: '<div class="uiSelectList"></div>',
        noListDataHTML: '<li style="font-size:12px;">无数据项..</li>'
      };
      opts = $.extend({}, defaults, options);
      dropDownListObj.constructor.__super__.constructor.call(dropDownListObj, self, opts);
      dropDownListObj.init();
    }

    DropDownList.prototype.init = function() {
      var dropDownListObj;
      dropDownListObj = this;
      dropDownListObj.createWidget();
      initDropDownList(dropDownListObj.jqObj, dropDownListObj.opts);
      return dropDownListObj;
    };

    DropDownList.prototype.selectedItem = function(index) {
      var dropDownListObj, opts, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      if (arguments.length === 0) return $('>.uiSelectList>.selected', self);
      $("> .uiSelectList > li:eq(" + index + ")", self).click();
      return dropDownListObj;
    };

    DropDownList.prototype.list = function(list) {
      var dropDownListObj, item, listItemObj, listShowTotal, opts, selectList, self, _i, _len;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      selectList = $('.uiSelectList', self);
      if (arguments.length === 0) return selectList.children();
      selectList.empty();
      if (typeof list === 'string') {
        selectList.html(list);
      } else if ($.isArray(list)) {
        if (list.length === 0) {
          selectList.append(opts.noListDataHTML);
        } else {
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            item = list[_i];
            selectList.append("<li>" + item + "</li>");
          }
        }
      } else {
        selectList.append(list);
      }
      listItemObj = selectList.find('>li');
      opts.selectItemTotal = listItemObj.length;
      if (opts.multiple) {
        listItemObj.prepend('<span class="uiSmallIcon uiSelectedIcon uiSelected"></span>');
      }
      listShowTotal = opts.pageSize;
      if (opts.showAll || opts.pageSize > opts.selectItemTotal) {
        listShowTotal = opts.selectItemTotal;
      }
      if (opts.listItemOuterHeight === 0) {
        opts.listItemOuterHeight = listItemObj.outerHeight(true);
      }
      selectList.height(opts.listItemOuterHeight * listShowTotal);
      $('>.uiSelectList >li', self).hover(function() {
        return ($(this)).addClass(opts.listItemHoverClass);
      }, function() {
        return ($(this)).removeClass(opts.listItemHoverClass);
      });
      return dropDownListObj;
    };

    DropDownList.prototype.showSelectList = function() {
      var dropDownListObj, opts, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      self.children('.uiSelectList').show();
      return dropDownListObj;
    };

    DropDownList.prototype.hideSelectList = function() {
      var dropDownListObj, opts, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      self.children('.uiSelectList').hide();
      return dropDownListObj;
    };

    DropDownList.prototype.val = function() {
      var dropDownListObj, opts, selectedValue, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      selectedValue = [];
      self.find('>.uiSelectList >.selected').each(function() {
        return selectedValue.push($(this).text());
      });
      return selectedValue;
    };

    return DropDownList;

  })($$.Widget);

  initDropDownList = function(self, opts) {
    var dropDown, liItemList, multiple, selectList;
    multiple = opts.multiple ? 'uiMultiple' : '';
    selectList = self.children().addClass("" + multiple + " uiSelectList " + opts.selectListClass);
    liItemList = $('>li', selectList);
    opts.selectItemTotal = liItemList.length;
    dropDown = $(opts.dropDownHTML);
    if (opts.dropListType === 'search') {
      dropDown.append("<input type=\"text\" value=\"" + opts.searchTip + "\" class=\"uiCornerAll\" />");
    } else {
      dropDown.append('<span></span>');
    }
    if (opts.multiple) {
      liItemList.prepend('<span class="uiSmallIcon uiSelectedIcon uiSelected"></span>');
    }
    self.prepend(dropDown).addClass("uiDorpDownList uiWidget " + opts.dropDownListClass);
    if (opts.dropListType === 'search') {
      dropDown.children('input').width(dropDown.width() - 2 * parseInt(dropDown.css('paddingLeft')) - dropDown.children('.uiDropDownBtn').outerWidth(true));
    }
    if (opts.showAll) {
      opts.pageSize = opts.selectItemTotal;
    } else {
      opts.listItemOuterHeight = liItemList.outerHeight();
      selectList.height(opts.listItemOuterHeight * opts.pageSize);
    }
    selectList.hide();
    initEvent(self, opts);
    return null;
  };

  initEvent = function(self, opts) {
    var selectList, selectedContent;
    selectedContent = $('> .uiDropDown > span, > .uiDropDown > input', self);
    $('>.uiDropDown', self).on('click.uiDorpDownList', function(e) {
      var obj;
      obj = $(this);
      if ((opts.click(self, obj, e)) === false) return false;
      return obj.siblings('.uiSelectList').slideToggle(opts.animateTime);
    });
    selectList = $('>.uiSelectList', self);
    if (opts.hasScrollBar) {
      selectList.scrollBar();
    } else {
      selectList.on('mousewheel.uiDorpDownList', function(e, delta) {
        var obj, showLiItem;
        obj = $(this);
        if ($('>li', obj).length <= opts.pageSize) return;
        if (delta < 0) {
          showLiItem = $('>li:not(:hidden):first', obj);
          if (showLiItem.nextAll('li').length >= opts.pageSize) showLiItem.hide();
        } else {
          $('>li:hidden:last', obj).show();
        }
        return false;
      });
    }
    selectList.on('click.uiDorpDownList', function(e) {
      var obj, propFunc, selectedValue, target;
      obj = $(this);
      target = $(e.target);
      propFunc = $.prop ? 'prop' : 'attr';
      if (target[propFunc]('tagName').toUpperCase() !== 'LI') {
        target = target.parent('li');
        if (target.length === 0) return;
      }
      selectedValue = target.toggleClass('selected').text();
      if (opts.multiple) {
        selectedValue = '';
        obj.children('.selected').each(function() {
          return selectedValue += $(this).text() + opts.divideChar;
        });
        selectedValue = selectedValue.substring(0, selectedValue.length - 1);
      } else {
        obj.slideUp();
      }
      if (opts.dropListType === 'search') {
        selectedContent.val(selectedValue);
      } else {
        selectedContent.html(selectedValue);
      }
      if ((opts.change(self, obj, selectedValue, e)) === false) return false;
    });
    $('> .uiSelectList > li', self).hover(function() {
      return $(this).addClass(opts.listItemHoverClass);
    }, function() {
      return $(this).removeClass(opts.listItemHoverClass);
    });
    return null;
  };

}).call(this);
(function() {
  var $, $$, initDialog, initEvent, setContentHeight,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.dialog = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Dialog);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Dialog = (function(_super) {

    __extends(Dialog, _super);

    Dialog.name = 'Dialog';

    function Dialog(self, options) {
      var defaults, dialogObj, opts;
      dialogObj = this;
      if (!(dialogObj instanceof $$.Dialog)) return new $$.Dialog(self, options);
      defaults = {
        dialogClass: "" + $$.defaultBorder + " uiCornerAll " + $$.defaultBoxShadow,
        titleBarClass: $$.defaultGradientBG,
        position: null,
        zIndex: 1000,
        draggable: false,
        resizable: false,
        minStatusWidth: 250,
        modal: false,
        buttonSet: null,
        minHeight: 300,
        maxHeight: 700,
        minWidth: 400,
        maxWidth: 1000,
        active: true,
        minimize: false,
        closable: true,
        noTitleBar: false,
        titleIcon: '',
        title: '',
        controlButton: true,
        autoOpen: true,
        destroyOnClose: true,
        closeAnimate: 'slideUp',
        openAnimate: 'slideDown',
        beforeClose: $.noop,
        close: $.noop,
        beforeOpen: $.noop,
        open: $.noop,
        beforeMin: $.noop,
        min: $.noop,
        beforeResume: $.noop,
        resume: $.noop,
        dragStart: $.noop,
        draging: $.noop,
        dragStop: $.noop,
        resizeStart: $.noop,
        resizing: $.noop,
        resizeStop: $.noop,
        minStatusHeight: 0,
        originHeight: 0,
        originWidth: 0,
        originPosition: null,
        overflowStatus: null,
        controlButtonSetHTML: '<div class="uiDialogButtonSet"><div class="uiUserBtn uiMinBtn uiIcon uiMinButtonIcon"></div><div class="uiUserBtn uiCloseBtn uiIcon uiCloseButtonIcon"></div></div>',
        titleBarHTML: '<div class="uiTitleBar"><div class="uiTitle"></div></div>',
        contentHTML: '<div class="uiContent"></div>',
        resizeHTML: '<div class="uiResizable"></div>',
        selectList: null
      };
      opts = $.extend(defaults, options);
      dialogObj.constructor.__super__.constructor.call(dialogObj, self, opts);
      dialogObj.init();
    }

    Dialog.prototype.init = function() {
      var dialogObj;
      dialogObj = this;
      dialogObj.createWidget();
      initDialog(dialogObj, dialogObj.jqObj, dialogObj.opts);
      return dialogObj;
    };

    Dialog.prototype.title = function(title) {
      var dialogObj, obj, opts, self;
      dialogObj = this;
      self = dialogObj.jqObj;
      opts = dialogObj.opts;
      obj = $('>.uiTitleBar >.uiTitle', self);
      if (arguments.length === 0) return obj.text();
      opts.title = title;
      return obj.html(obj.html().replace(obj.text(), title));
    };

    Dialog.prototype.titleIcon = function(titleIcon) {
      var dialogObj, obj, opts, self;
      dialogObj = this;
      self = dialogObj.jqObj;
      opts = dialogObj.opts;
      if (arguments.length === 0) return opts.titleIcon;
      if (opts.titleIcon !== '') {
        $('>.uiTitleBar >.uiTitle', self).prepend('<span class="uiTitleIcon" />');
      }
      obj = $('>.uiTitleBar >.uiTitle >.uiTitleIcon', self).removeClass(opts.titleIcon).addClass(titleIcon);
      opts.titleIcon = titleIcon;
      return dialogObj;
    };

    Dialog.prototype.content = function(content) {
      var contentObj, dialogObj, opts, self;
      dialogObj = this;
      self = dialogObj.jqObj;
      opts = dialogObj.opts;
      contentObj = self.children('.uiContent');
      if (arguments.length === 0) return contentObj;
      contentObj.empty().append($(content));
      return dialogObj;
    };

    return Dialog;

  })($$.Widget);

  initDialog = function(dialogObj, self, opts) {
    var buttonSetHTML, buttonSetObj, contentObj, controlButton, key, maskObj, titleBar, titleBarClass, value, _ref;
    titleBarClass = "" + opts.titleBarClass + " uiCornerAll";
    if (opts.title === '') opts.title = (self.attr('title')) || '';
    if (opts.draggable) titleBarClass += ' uiDraggable';
    if (opts.controlButton) {
      controlButton = $(opts.controlButtonSetHTML);
      if (!opts.minimize) controlButton.children('.uiMinBtn').hide();
      if (!opts.closable) controlButton.children('.uiCloseBtn').hide();
    }
    contentObj = self.children().addClass('uiContent');
    if (!opts.noTitleBar) {
      titleBar = $(opts.titleBarHTML).addClass(titleBarClass).append(controlButton).children('.uiTitle').html(opts.title).end();
      if (opts.titleIcon !== '') {
        titleBar.children('.uiTitle').prepend($('<span class="uiTitleIcon" />')).addClass(opts.titleIcon);
      }
      self.prepend(titleBar);
    }
    self.addClass("uiDialog uiWidget " + opts.dialogClass);
    if (opts.position !== null) {
      self.css('zIndex', opts.zIndex + 1).moveToPos(opts.position);
    }
    if (opts.modal) {
      maskObj = $('<div />').addClass('uiMask').appendTo('body');
      if (opts.position === null) {
        self.css('zIndex', opts.zIndex + 1).moveToPos({
          position: 'center'
        });
      }
      if ($$.msie6) {
        opts.selectList = $('select:visible').filter(function() {
          if ($(this).css('visibility' !== 'hidden')) return true;
        });
        opts.selectList.css('visibility', 'hidden');
        maskObj.height($(document).height());
      }
    }
    if (opts.buttonSet !== null) {
      buttonSetHTML = '<div>';
      _ref = opts.buttonSet;
      for (key in _ref) {
        value = _ref[key];
        buttonSetHTML += '<div>' + key + '</div>';
      }
      buttonSetHTML += '</div>';
      buttonSetObj = $(buttonSetHTML).buttonSet({
        click: function(target) {
          if ((opts.buttonSet[target.text()](this)) === false) return false;
          return dialogObj.close(self, opts, target);
        }
      });
      buttonSetObj.appendTo(self);
    }
    if (opts.resizable) {
      self.append(opts.resizeHTML);
      if (self.css('position') === 'static') self.css('position', 'relative');
    }
    opts.minHeight = Math.min(self.height(), opts.minHeight);
    opts.minWidth = Math.min(self.width(), opts.minWidth);
    setContentHeight(self, opts);
    initEvent(dialogObj, self, opts);
    if (!opts.autoOpen) return self.hide();
  };

  initEvent = function(dialogObj, self, opts) {
    var dragStopFunction, posStr, resizeStopFunc;
    posStr = self.css('position');
    self.find('>.uiTitleBar >.uiDialogButtonSet >.uiUserBtn').on('click.uiDialog', function(e) {
      var func, obj;
      obj = $(this);
      if (obj.hasClass('uiMinBtn')) {
        func = 'min';
      } else if (obj.hasClass('uiResumeBtn')) {
        func = 'resume';
      } else if (obj.hasClass('uiCloseBtn')) {
        func = 'close';
      }
      if (func != null) {
        if (self.is(':animated')) return false;
        dialogObj[func](self, opts, obj, e);
        return false;
      }
    });
    if (opts.draggable) {
      dragStopFunction = function(dragObj, mask, offset) {
        if ((opts.dragStop(self)) === false) return false;
        return self.offset(offset);
      };
      self.draggable({
        event: {
          start: opts.dragStart,
          doing: opts.draging,
          stop: dragStopFunction
        }
      });
    }
    if (opts.resizable) {
      resizeStopFunc = function(resizeObj, mask, width, height) {
        var content, otherItemHeightTotal, outerOffset;
        if ((opts.resizeStop(self)) === false) return false;
        height = Math.min(Math.max(opts.minHeight, height), opts.maxHeight);
        width = Math.min(Math.max(opts.minWidth, width), opts.maxWidth);
        otherItemHeightTotal = 0;
        content = self.width(width).height(height).children('.uiContent');
        self.children().each(function() {
          var obj;
          obj = $(this);
          if (!obj.hasClass('uiContent' && (!obj.hasClass('uiResizable')))) {
            return otherItemHeightTotal += obj.outerHeight(true);
          }
        });
        outerOffset = content.outerHeight(true - content.height());
        return content.height(height - otherItemHeightTotal - outerOffset);
      };
      return self.resizable({
        event: {
          start: opts.resizeStart,
          doing: opts.resizing,
          stop: resizeStopFunc
        },
        minHeight: opts.minHeight,
        maxHeight: opts.maxHeight,
        minWidth: opts.minWidth,
        maxWidth: opts.maxWidth
      });
    }
  };

  setContentHeight = function(self, opts) {
    var completeLoad, content, contentHeight, imgList, imgTotal, otherItemHeightTotal, outerOffset;
    otherItemHeightTotal = 0;
    content = self.children('.uiContent');
    self.children().each(function() {
      var obj;
      obj = $(this);
      if (!obj.hasClass('uiContent' && !(obj.hasClass('uiResizable')))) {
        return otherItemHeightTotal += $(this).outerHeight(true);
      }
    });
    contentHeight = content.outerHeight(true);
    outerOffset = contentHeight - content.height();
    imgList = self.find('img');
    imgTotal = imgList.length;
    if (imgTotal === 0) {
      completeLoad = 0;
      imgList.each(function() {
        if (this.complete) {
          completeLoad++;
          if (completeLoad === imgTotal) {
            return content.height(self.height() - otherItemHeightTotal - outerOffset);
          }
        } else {
          return $(this).load(function() {
            completeLoad++;
            if (completeLoad === imgTotal) {
              return content.height(self.height() - otherItemHeightTotal - outerOffset);
            }
          });
        }
      });
    }
    content.height(self.height() - otherItemHeightTotal - outerOffset);
    return null;
  };

}).call(this);
(function() {
  var $, $$, initEvent, initMenu,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.menu = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Menu);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Menu = (function(_super) {

    __extends(Menu, _super);

    Menu.name = 'Menu';

    function Menu(self, options) {
      var defaults, menuObj, opts;
      menuObj = this;
      if (!(menuObj instanceof $$.Menu)) return new $$.Menu(self, options);
      defaults = {
        topMenuClass: $$.defaultGradientBG,
        subMenuClass: "" + $$.defaultGradientBG + " uiCornerAll " + $$.defaultBorder,
        hoverClass: $$.hoverGradientBG
      };
      opts = $.extend(defaults, options);
      menuObj.constructor.__super__.constructor.call(menuObj, self, opts);
      menuObj.init();
    }

    Menu.prototype.init = function() {
      var menuObj;
      menuObj = this;
      menuObj.createWidget();
      initMenu(menuObj.jqObj, menuObj.opts);
      return menuObj;
    };

    return Menu;

  })($$.Widget);

  initMenu = function(self, opts) {
    var topLevelListObj, topMenuWidth;
    topLevelListObj = self.addClass("uiMenu uiWidget " + opts.topMenuClass).children('ul');
    topLevelListObj.addClass('uiTopLevel').children('li:not(:last)').addClass('uiRightBorder');
    topLevelListObj.find('ul').addClass("uiSubLevel " + opts.subMenuClass).children('li:not(::last-child)').children('a').addClass('uiBottomBorder');
    topMenuWidth = 0;
    $('>li', topLevelListObj).each(function() {
      return topMenuWidth += ($(this)).outerWidth(true);
    });
    topLevelListObj.width(topMenuWidth);
    return initEvent(self, opts);
  };

  initEvent = function(self, opts) {
    return self.find('li').hover(function() {
      return $(this).addClass(opts.hoverClass);
    }, function() {
      return $(this).removeClass(opts.hoverClass);
    });
  };

}).call(this);
(function() {
  var $, $$, initProgressBar,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.progressBar = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.ProgressBar);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.ProgressBar = (function(_super) {

    __extends(ProgressBar, _super);

    ProgressBar.name = 'ProgressBar';

    function ProgressBar(self, options) {
      var defaults, opts, progressBarObj;
      progressBarObj = this;
      if (!(progressBarObj instanceof $$.ProgressBar)) {
        return new $$.ProgressBar(self, options);
      }
      defaults = {
        progressBarClass: "" + $$.defaultGradientBG + " " + $$.defaultBorder,
        progressBlockClass: $$.hoverGradientBG,
        blockWidth: 12,
        marginValue: null,
        type: "normal",
        scrollTime: 3000,
        scrollValue: 0.19,
        value: 0,
        progressBarLength: 0,
        scrolling: false
      };
      opts = $.extend(defaults, options);
      progressBarObj.constructor.__super__.constructor.call(progressBarObj, self, opts);
      progressBarObj.init();
    }

    ProgressBar.prototype.init = function() {
      var opts, progressBarObj;
      progressBarObj = this;
      opts = progressBarObj.opts;
      progressBarObj.createWidget();
      initProgressBar(progressBarObj.jqObj, progressBarObj.opts);
      progressBarObj.val(opts.scrollValue);
      if (opts.type === 'scroll') progressBarObj.scroll(true);
      return progressBarObj;
    };

    ProgressBar.prototype.val = function(value) {
      var opts, progressBarObj, self;
      progressBarObj = this;
      self = progressBarObj.jqObj;
      opts = progressBarObj.opts;
      if (arguments.length === 0) return opts.value;
      opts.value = value > 1 ? 1 : (value < 0 ? 0 : value);
      self.children('.progressValue').width(opts.progressBarLength * opts.value);
      return progressBarObj;
    };

    ProgressBar.prototype.scroll = function(scrolling) {
      var marginLeftValue, obj, opts, progressBarObj, self;
      progressBarObj = this;
      self = progressBarObj.jqObj;
      opts = progressBarObj.opts;
      if (opts.type !== 'scroll' || (scrolling && opts.scrolling)) {
        return progressBarObj;
      }
      obj = self.children('.progressValue');
      if (!scrolling) {
        opts.scrolling = false;
        obj.stop();
      } else {
        marginLeftValue = opts.progressBarLength - (obj.width() + parseInt(obj.css('marginLeft')));
        opts.scrolling = true;
        obj.animate({
          marginLeft: marginLeftValue
        }, opts.scrollTime, function() {
          opts.scrolling = false;
          return progressBarObj.scroll(self, opts, true);
        });
      }
      return progressBarObj;
    };

    return ProgressBar;

  })($$.Widget);

  initProgressBar = function(self, opts) {
    var blockTotal, i, marginValue, obj, progressValue, _i;
    progressValue = $('<div class="progressValue"></div>');
    marginValue = opts.marginValue || 2;
    blockTotal = Math.ceil(self.width() / (opts.blockWidth + marginValue));
    for (i = _i = 1; 1 <= blockTotal ? _i <= blockTotal : _i >= blockTotal; i = 1 <= blockTotal ? ++_i : --_i) {
      obj = $('<div class="progressBlock"></div>').addClass(opts.progressBlockClass).width(opts.blockWidth);
      if (opts.marginValue !== null) obj.css('marginRight', opts.marginValue);
      progressValue.append(obj);
    }
    return opts.progressBarLength = self.addClass("uiProgressBar uiWidget " + opts.progressBarClass).append(progressValue).width();
  };

}).call(this);
(function() {
  var $, $$, initEvent, initList,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.list = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.List);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.List = (function(_super) {

    __extends(List, _super);

    List.name = 'List';

    function List(self, options) {
      var defaults, listObj, opts;
      listObj = this;
      if (!(listObj instanceof $$.List)) return new $$.List(self, options);
      defaults = {
        title: null,
        indexKey: "data-key",
        titleBarClass: $$.defaultGradientBG,
        titleIcon: null,
        listClass: "" + $$.defaultBorder + " uiCornerAll " + $$.defaultBoxShadow,
        listItemClass: "uiListItem",
        listItemHoverClass: "uiLightBlueGradientBG",
        listItemSelectedClass: "uiBlueGradientBG",
        click: $.noop,
        listBackIndexArr: [],
        showListItem: null,
        listWidth: 0,
        titleBarHTML: '<div class="uiListTitleBar uiNoSelectText"><span></span><span class="uiListBack uiIcon uiBackIcon">Back</span></div>',
        moreItemHTML: '<span class="uiListMoreBtn uiArrowRightIcon uiSmallIcon"></span>'
      };
      opts = $.extend(defaults, options);
      listObj.constructor.__super__.constructor.call(listObj, self, opts);
      listObj.init();
    }

    List.prototype.init = function() {
      var listObj;
      listObj = this;
      listObj.createWidget();
      initList(listObj.jqObj, listObj.opts);
      return listObj;
    };

    return List;

  })($$.Widget);

  initList = function(self, opts) {
    var title, titleBar, ulHeight;
    title = opts.title || (self.attr('title')) || '';
    self.addClass("uiList uiWidget " + opts.listClass).children('div:first').addClass('uiListContent');
    if (title) {
      titleBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).children('span:first').html(title).end();
      if (opts.titleIcon) {
        titleBar.prepend($('<span class="uiTitleIcon" />').addClass(opts.titleIcon));
      }
      self.prepend(titleBar);
    }
    self.find('li').each(function() {
      var obj;
      obj = $(this);
      obj.addClass(opts.listItemClass);
      if (obj.attr(opts.indexKey)) {
        return obj.addClass('uiListMore').prepend(opts.moreItemHTML);
      }
    });
    ulHeight = self.height() - $('>.uiListTitleBar', self).outerHeight(true);
    opts.listWidth = $('>.uiListContent > ul', self).filter(':gt(0)').hide().end().height(ulHeight).width();
    return initEvent(self, opts);
  };

  initEvent = function(self, opts) {
    $('>.uiListTitleBar >.uiListBack', self).on('click.uiList', function(e) {
      var marginLeftValue, number, obj;
      number = opts.listBackIndexArr.pop();
      if (opts.listBackIndexArr.length === 0) {
        $(this).fadeOut(opts.defaultAnimateDuration);
      }
      obj = $('>.uiListContent > ul', self).filter("[" + opts.indexKey + "=\"" + number + "\"]");
      if (obj.length === 0) return;
      marginLeftValue = obj.css('marginLeft');
      return obj.css('marginLeft', -opts.listWidth).show().animate({
        marginLeft: 0
      }, opts.defaultAnimateDuration, function() {
        if (opts.showListItem != null) opts.showListItem.show();
        return $(this).css('marginLeft', marginLeftValue);
      });
    });
    return $('>.uiListContent > ul', self).on('click.uiList mouseover.uiList mouseout.uiList', function(e) {
      var currentNumber, currentObj, jQueryProp, marginLeftValue, number, obj, target;
      target = $(e.target);
      jQueryProp = self.prop ? 'prop' : 'attr';
      if (target[jQueryProp]('tagName').toUpperCase() !== 'LI') {
        target = target.parent();
      }
      if (event.type === 'click') {
        if (target.hasClass('uiListMore')) {
          number = target.attr(opts.indexKey);
          currentObj = $(this);
          currentNumber = currentObj.attr(opts.indexKey);
          obj = currentObj.siblings("[" + opts.indexKey + "=\"" + number + "\"]").show();
          if (obj.length === 0) return;
          $('>.uiListTitleBar >.uiListBack', self).fadeIn(opts.defaultAnimateDuration);
          opts.listBackIndexArr.push(currentNumber);
          marginLeftValue = currentObj.css('marginLeft');
          return currentObj.animate({
            marginLeft: -opts.listWidth
          }, opts.defaultAnimateDuration, function() {
            opts.showListItem = obj;
            return $(this).hide().css('marginLeft', marginLeftValue);
          });
        } else {
          target.removeClass(opts.listItemHoverClass).addClass(opts.listItemSelectedClass);
          target.siblings("." + opts.listItemSelectedClass).toggleClass("" + opts.listItemClass + " " + opts.listItemSelectedClass);
          return opts.click(self, target, e);
        }
      } else if (event.type === 'mouseover') {
        if (target.hasClass(opts.listItemClass)) {
          return target.removeClass(opts.listItemClass).addClass(opts.listItemHoverClass);
        }
      } else if (event.type === 'mouseout') {
        if (target.hasClass(opts.listItemHoverClass)) {
          return target.removeClass(opts.listItemHoverClass).addClass(opts.listItemClass);
        }
      }
    });
  };

}).call(this);
(function() {
  var $, $$, initEvent, initTip, setPosition,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.tip = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Tip);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Tip = (function(_super) {

    __extends(Tip, _super);

    Tip.name = 'Tip';

    function Tip(self, options) {
      var defaults, opts, tipObj;
      tipObj = this;
      if (!(tipObj instanceof $$.Tip)) return new $$.Tip(self, options);
      defaults = {
        tipClass: 'uiCornerAll',
        borderColor: '#315389',
        backgroundColor: '#315389',
        backgroundClass: $$.defaultGradientBG,
        target: null,
        direction: 'top',
        arrowPositionValue: '40%',
        tipWidth: 0,
        tipHeight: 0,
        showAnimate: 'slideDown',
        hideAnimate: 'slideUp',
        beforeShow: $.noop,
        show: $.noop,
        beforeHide: $.noop,
        hide: $.noop,
        targetObj: null,
        tipStyle: null,
        arrowOffset: 10,
        offset: null,
        tipHTML: '<div></div><div></div>'
      };
      opts = $.extend(defaults, options);
      tipObj.constructor.__super__.constructor.call(tipObj, self, opts);
      tipObj.init();
    }

    Tip.prototype.init = function() {
      var tipObj;
      tipObj = this;
      tipObj.createWidget();
      initTip(tipObj.jqObj, tipObj.opts);
      return tipObj;
    };

    Tip.prototype.content = function(content, resetPosition) {
      var contentObj, opts, self, tipObj;
      tipObj = this;
      self = tipObj.jqObj;
      opts = tipObj.opts;
      contentObj = self.children('.uiTipContent');
      if (!content) return contentObj;
      contentObj.html(content);
      if (resetPosition === true) setPosition(self, opts);
      return tipObj;
    };

    Tip.prototype.arrowPosition = function(value) {
      var arrowList, opts, self, tipObj;
      tipObj = this;
      self = tipObj.jqObj;
      opts = tipObj.opts;
      arrowList = self.children('.uiTipArrowStyle1, .uiTipArrowStyle2');
      if (arguments.length === 0) return opts.positionValue;
      if (opts.tipStyle === 1) {
        arrowList.css('left', value);
      } else {
        arrowList.css('top', value);
      }
      opts.positionValue = value;
      return tipObj;
    };

    Tip.prototype.beforeDestroy = function() {
      var opts, self, tipObj;
      tipObj = this;
      self = tipObj.jqObj;
      opts = tipObj.opts;
      opts.targetObj.off("." + opts.widgetKey);
      return tipObj;
    };

    return Tip;

  })($$.Widget);

  initTip = function(self, opts) {
    var contentObj, cssShow, tip;
    opts.targetObj = $(opts.target);
    tip = $(opts.tipHTML);
    if (opts.direction === 'top' || opts.direction === 'bottom') {
      tip.addClass('uiTipArrowStyle1');
      opts.tipStyle = 1;
    } else {
      tip.addClass('uiTipArrowStyle2');
      opts.tipStyle = 2;
    }
    contentObj = self.children();
    if (contentObj.length === 0) {
      self.wrapInner('<div class="uiTipContent" />');
    } else {
      contentObj.addClass('uiTipContent');
    }
    self.addClass("uiTip uiWidget " + opts.tipClass).prepend(tip);
    cssShow = {
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    };
    $.swap(self[0], cssShow, function() {
      return setPosition(self, opts);
    });
    initEvent(self, opts);
    return self.hide();
  };

  initEvent = function(self, opts) {
    var targetObj;
    targetObj = opts.targetObj;
    if (targetObj.length !== 0) {
      targetObj.on("mouseenter." + opts.widgetKey, function(e) {
        var target;
        target = $(this);
        if ((opts.beforeShow(self, target, e)) === false) return false;
        return self.stop(true, true)[opts.showAnimate](opts.animateTime, function() {
          return opts.show(self, target, e);
        });
      });
      return targetObj.on("mouseleave." + opts.widgetKey, function(e) {
        var target;
        target = $(this);
        if ((opts.beforeHide(self, target, e)) === false) return false;
        return self.stop(true, true)[opts.hideAnimate](opts.animateTime, function() {
          return opts.hide(self, target, e);
        });
      });
    }
  };

  setPosition = function(self, opts) {
    var arrow1, arrow1LeftValue, arrow1TopValue, arrow2, arrow2LeftValue, arrow2TopValue, arrowList, leftValue, setting, targetHeight, targetObj, targetObjOffset, targetWidth, tipHeight, tipWidth, topValue;
    targetObj = opts.targetObj;
    if (targetObj.length === 0) return;
    targetObjOffset = targetObj.offset();
    leftValue = targetObjOffset.left;
    topValue = targetObjOffset.top;
    targetWidth = targetObj.outerWidth();
    targetHeight = targetObj.outerHeight();
    arrowList = self.children('.uiTipArrowStyle1, .uiTipArrowStyle2');
    arrow1 = arrowList.eq(0);
    arrow2 = arrowList.eq(1);
    setting = {
      top: {
        border: 'border-top-color',
        borderNone: 'border-bottom'
      },
      bottom: {
        border: 'border-bottom-color',
        borderNone: 'border-top'
      },
      left: {
        border: 'border-left-color',
        borderNone: 'border-right'
      },
      right: {
        border: 'border-right-color',
        borderNone: 'border-left'
      }
    };
    if (opts.tipWidth !== 0) {
      self.width(opts.tipWidth);
      tipWidth = opts.tipWidth;
    } else {
      tipWidth = self.width();
    }
    if (opts.tipHeight !== 0) {
      self.height(opts.tipHeight);
    } else {
      tipHeight = self.height();
    }
    self.css('borderColor', opts.borderColor);
    if (opts.backgroundClass === null) {
      self.css('backgroundColor', opts.backgroundColor);
    } else {
      self.addClass(opts.backgroundClass);
    }
    arrow1.css(setting[opts.direction].border, opts.borderColor);
    arrow2.css(setting[opts.direction].border, opts.backgroundColor);
    arrowList.css(setting[opts.direction].borderNone, "none");
    arrow1TopValue = arrow2TopValue = arrow1LeftValue = arrow2LeftValue = opts.arrowPositionValue;
    if (opts.tipStyle === 1) {
      leftValue += targetWidth / 2 - tipWidth / 2;
      arrow1TopValue = -opts.arrowOffset;
      arrow2TopValue = arrow1TopValue + 1;
      if (opts.direction === 'bottom') {
        topValue += targetHeight + opts.arrowOffset;
      } else if (opts.direction === 'top') {
        topValue -= tipHeight + opts.arrowOffset;
        arrow1TopValue = tipHeight;
        arrow2TopValue = arrow1TopValue - 1;
      }
    } else {
      arrow1LeftValue = tipWidth;
      arrow2LeftValue = arrow1LeftValue - 1;
      if (opts.direction === 'left') {
        leftValue -= tipWidth + opts.arrowOffset;
      } else if (opts.direction === 'right') {
        leftValue += targetWidth + opts.arrowOffset;
        arrow1LeftValue = -opts.arrowOffset;
        arrow2LeftValue = arrow1LeftValue + 1;
      }
    }
    if ($.isPlainObject(opts.offset)) {
      leftValue += opts.offset.left || 0;
      topValue += opts.offset.top || 0;
    }
    self.css({
      left: leftValue,
      top: topValue
    });
    arrow1.css({
      top: arrow1TopValue,
      left: arrow1LeftValue
    });
    return arrow2.css({
      top: arrow2TopValue,
      left: arrow2LeftValue
    });
  };

}).call(this);
