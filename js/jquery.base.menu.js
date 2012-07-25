(function() {
  var $, $$, initEvent, initMenu,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  /**
   * [menu description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[jQuery, Others]}         [description]
  */


  $.fn.menu = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Menu);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') {
      return self;
    }
    return result;
  };

  $$.Menu = (function(_super) {

    __extends(Menu, _super);

    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} {[Optional]} options [description]
     * @return {[Menu]}         [description]
    */


    function Menu(self, options) {
      var defaults, menuObj, opts;
      menuObj = this;
      if (!(menuObj instanceof $$.Menu)) {
        return new $$.Menu(self, options);
      }
      defaults = {
        topMenuClass: $$.defaultGradientBG,
        subMenuClass: "" + $$.defaultGradientBG + " uiCornerAll " + $$.defaultBorder,
        hoverClass: $$.hoverGradientBG
      };
      opts = $.extend(defaults, options);
      menuObj.constructor.__super__.constructor.call(menuObj, self, opts);
      menuObj.init();
    }

    /**
     * [init description]
     * @return {[Menu]} [description]
    */


    Menu.prototype.init = function() {
      var menuObj;
      menuObj = this;
      menuObj.createWidget();
      initMenu(menuObj.jqObj, menuObj.opts);
      return menuObj;
    };

    return Menu;

  })($$.Widget);

  /**
   * [initMenu description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


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
    initEvent(self, opts);
    return null;
  };

  /**
   * [initEvent description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


  initEvent = function(self, opts) {
    self.find('li').hover(function() {
      return $(this).addClass(opts.hoverClass);
    }, function() {
      return $(this).removeClass(opts.hoverClass);
    });
    return null;
  };

}).call(this);
