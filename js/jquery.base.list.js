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
