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
