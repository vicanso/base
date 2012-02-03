(function() {
  var $, $$,
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
      var buttonSetObj, opts;
      buttonSetObj = this;
      if (!(buttonSetObj instanceof $$.ButtonSet)) {
        return new $$.ButtonSet(self, options);
      }
      opts = $.extend({}, $$.ButtonSet.prototype.defaults, options);
      buttonSetObj.constructor.__super__.constructor.call(buttonSetObj, self, opts);
      buttonSetObj.init();
    }

    ButtonSet.prototype.defaults = {
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

    ButtonSet.prototype.init = function() {
      var buttonSetObj;
      buttonSetObj = this;
      buttonSetObj.createWidget();
      initButtonSet(buttonSetObj.jqObj, buttonSetObj.opts);
      return buttonSetObj;
    };

    ButtonSet.prototype.click = function(index) {
      var buttonSetObj, obj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      if (index == null) index = 0;
      obj = (self.children().eq(index)).click();
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
      (obj.html(text)).prepend(iconObj);
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
      ((obj.children('.uiIcon')).removeClass(iconClass)).addClass(icon);
      opts.iconArray[index] = icon;
      return buttonSetObj;
    };

    ButtonSet.prototype.val = function(index, checked) {
      var buttonSetObj, opts, self;
      buttonSetObj = this;
      self = buttonSetObj.jqObj;
      opts = buttonSetObj.opts;
      return index != null ? index : index = 0;
    };

    return ButtonSet;

  })($$.Widget);

}).call(this);
