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
