(function() {
  var $, $$, initEvent, initSlide, setSlide,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  /**
   * [slide description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[jQuery, Others]}         [description]
  */


  $.fn.slide = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Slide);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') {
      return self;
    }
    return result;
  };

  $$.Slide = (function(_super) {

    __extends(Slide, _super);

    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} {[Optional]} options [description]
     * @return {[Slide]}         [description]
    */


    function Slide(self, options) {
      var defaults, opts, slideObj;
      slideObj = this;
      if (!(slideObj instanceof $$.Slide)) {
        return new $$.Slide(self, options);
      }
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

    /**
     * [init description]
     * @return {[Slide]} [description]
    */


    Slide.prototype.init = function() {
      var slideObj;
      slideObj = this;
      slideObj.createWidget();
      initSlide(slideObj.jqObj, slideObj.opts);
      return slideObj;
    };

    /**
     * [val description]
     * @param  {[Integer]} {[Optional]} value   [description]
     * @param  {[Boolean]} {[Optional]} animate [description]
     * @return {[Slide]}         [description]
    */


    Slide.prototype.val = function(value, animate) {
      var opts, self, slideObj;
      slideObj = this;
      self = slideObj.jqObj;
      opts = slideObj.opts;
      if (arguments.length === 0) {
        return opts.slideValue;
      }
      if (arguments.length === 1) {
        animate = true;
      }
      if (!opts.slideDrag) {
        return setSlide(self, opts, value, animate, true);
      }
    };

    /**
     * [beforeDestroy description]
     * @return {[Slide]} [description]
    */


    Slide.prototype.beforeDestroy = function() {
      var opts, self, slideObj;
      slideObj = this;
      self = slideObj.jqObj;
      opts = slideObj.opts;
      $(docuemnt).off("." + opts.widgetKey);
      return slideObj;
    };

    return Slide;

  })($$.Widget);

  /**
   * [initSlide description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


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
    if (opts.userImageSlider) {
      opts.sliderLength = slider.width();
    }
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
    if (!opts.userImageSlider) {
      opts.slideMax -= opts.sliderLength - 2;
    }
    if (!opts.noUserEvent) {
      initEvent(self, opts);
    }
    if (opts.slideValue !== 0) {
      setSlide(self, opts, opts.slideValue);
    }
    return null;
  };

  /**
   * [initEvent description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


  initEvent = function(self, opts) {
    var documentObj, mouseMoveEvent, mouseUpEvent, panelObj;
    documentObj = $(document);
    panelObj = $('>.uiPanel', self);
    panelObj.on('click.uiSlide', function(e) {
      var beginValue, percent;
      if ($(e.target).hasClass('uiSlider')) {
        return false;
      }
      if ((opts.click(self, $(this, e))) === false) {
        return false;
      }
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
      if (opts.mode === 'vertical') {
        positionStr = 'top';
      }
      percent = (parseInt($('>.uiSlider', this).css(positionStr))) / opts.slideMax;
      setSlide(self, opts, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
      return false;
    });
    $('>.uiSlider', panelObj).on('mousedown.uiSlide', function(e) {
      return opts.slideDrag = true;
    });
    mouseMoveEvent = "mousemove." + opts.widgetKey;
    mouseUpEvent = "mouseup." + opts.widgetKey;
    documentObj.on({
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
    return null;
  };

  /**
   * [setSlide description]
   * @param {[jQuery]} self      [description]
   * @param {[Object]} opts      [description]
   * @param {[Integer]} value     [description]
   * @param {[Boolean]} animate   [description]
   * @param {[Boolean]} jumpToEnd [description]
  */


  setSlide = function(self, opts, value, animate, jumpToEnd) {
    var obj, percent, props, sliderCross, sliderCrossProps, sliderCrossValue;
    obj = $('>.uiPanel >.uiSlider', self);
    if (value == null) {
      value = 0;
    }
    value = value > opts.max ? opts.max : (value < 0 ? 0 : value);
    opts.slideValue = value;
    percent = (value - opts.min) / (opts.max - opts.min);
    value = opts.slideMax * percent;
    if (opts.userImageSlider && value === 0) {
      value = -(opts.sliderLength >> 2);
    }
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
      sliderCross.stop(true, jumpToEnd).animate(sliderCrossProps, opts.animateTime);
    } else {
      obj.css(props);
      sliderCross.css(sliderCrossProps);
      opts.slide(self, obj, opts.slideValue);
    }
    return null;
  };

}).call(this);
