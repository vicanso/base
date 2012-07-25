(function() {
  var $, $$, RandomString;

  $$ = window.BASE = window.BASE || {};

  $ = window.jQuery;

  RandomString = (function() {
    /**
     * [constructor 用于生成随机字符串（用于标识Widget ID）]
     * @param  {[String]} {[Optional]} legalCharList [随机的字符串集]
     * @return {[RandomString]} [返回RandomString对象]
    */

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

    /**
     * [getRandomStr 获取随机字符串]
     * @param  {[Integer]} {[Optional]} len [指定随机字符串的长度]
     * @return {[String]}     [返回随机字符串]
    */


    RandomString.prototype.getRandomStr = function(len) {
      var num;
      if (len == null) {
        len = 10;
      }
      return ((function() {
        var _i, _results;
        _results = [];
        for (num = _i = 1; _i <= 10; num = ++_i) {
          _results.push(this.getRandomChar(num));
        }
        return _results;
      }).call(this)).join("");
    };

    /**
     * [getRandomChar 获取随机字符]
     * @return {[Char]} [返回一个随机字符]
    */


    RandomString.prototype.getRandomChar = function() {
      return this.legalCharList[Math.floor(Math.random() * this.legalListLength)];
    };

    return RandomString;

  })();

  $.extend($$, {
    version: "0.8.1",
    msie6: $.browser.msie && $.browser.version === "6.0",
    defaultAnimateDuration: 300,
    defaultBorder: "uiBlackBorder",
    defaultBoxShadow: "uiBlackBoxShadow",
    defaultGradientBG: "uiBlackGradientBG",
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
    /**
     * [widgetDictionary 保存Widget对象的Map结构]
     * @type {Object}
    */

    widgetDictionary: {},
    /**
     * [randomKey RandomString的实例，用于返回随机的Widget ID]
     * @type {RandomString}
    */

    randomKey: new RandomString(),
    /**
     * [getWidget 获取Widget对象]
     * @param  {[String]} key [Widget对象ID]
     * @return {[Widget]}     [Widget对象]
    */

    getWidget: function(key) {
      var widget;
      widget = this.widgetDictionary[key];
      if (widget != null) {
        return widget;
      }
    },
    /**
     * [addWidget 添加Widget对象到widgetDictionary中]
     * @param {[String]} key    [Widget对象的ID]
     * @param {[Widget]} widget [Widget对象]
    */

    addWidget: function(key, widget) {
      if ((key != null) && (widget != null)) {
        return this.widgetDictionary[key] = widget;
      }
    },
    /**
     * [removeWidget 删除Widget对象]
     * @param  {[String]} key [Widget对象的ID]
     * @return {[Boolean]}     [删除结果]
    */

    removeWidget: function(key) {
      var opts, prop, widget;
      widget = this.widgetDictionary[key];
      if (!delete this.widgetDictionary[key]) {
        this.widgetDictionary[key] = null;
      }
      if (widget != null) {
        opts = widget.opts;
      }
      for (prop in opts) {
        if (opts.hasOwnProperty(prop)) {
          if (!(delete opts[prop])) {
            opts[prop] = null;
          }
        }
      }
      for (prop in widget) {
        if (widget.hasOwnProperty(prop)) {
          if (!(delete widget[prop])) {
            widget[prop] = null;
          }
        }
      }
      return true;
    },
    /**
     * [getRandomKey 获取随机字符串]
     * @param  {[Integer]} length [字符串长度]
     * @return {[String]}        [返回该长度的随机字符串]
    */

    getRandomKey: function(length) {
      return this.randomKey.getRandomStr(length);
    },
    /**
     * [createWidgetByJQuery 通过jQuery方法创建Widget对象]
     * @return {[Widget]} [返回jQuery对象]
    */

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
