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
    if (targetObj.length === 0) {
      targetObj.on("mouseenter." + opts.widgetKey, function(e) {
        var target;
        target = $(this);
        if ((opts.beforeShow(self, target, e)) === false) return false;
        return self.stop(true, true)[opts.showAnimate](opts.animateTime, function() {
          return opts.show(self, target(e));
        });
      });
      return targetObj.on("mouseleave." + opts.widgetKey, function(e) {
        var target;
        target = $(this);
        if ((opts.beforeHide(self, target, e)) === false) return false;
        return self.stop(true, true)[opts.hideAnimate](opts.animateTime, function() {
          return opts.hide(self, target(e));
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
