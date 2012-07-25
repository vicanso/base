(function() {
  var $, $$, checkItemViewStatus, initEvent, initTabs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  /**
   * [tabs description]
   * @param  {[Object]} options [description]
   * @return {[jQuery]}         [description]
  */


  $.fn.tabs = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Tabs);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') {
      return self;
    }
    return result;
  };

  $$.Tabs = (function(_super) {

    __extends(Tabs, _super);

    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} {[Optional]} options [description]
     * @return {[Tabs]}         [description]
    */


    function Tabs(self, options) {
      var defaults, opts, tabsObj;
      tabsObj = this;
      if (!(tabsObj instanceof $$.Tabs)) {
        return new $$.Tabs(self, options);
      }
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

    /**
     * [init description]
     * @return {[Tabs]} [description]
    */


    Tabs.prototype.init = function() {
      var tabsObj;
      tabsObj = this;
      tabsObj.createWidget();
      initTabs(tabsObj.jqObj, tabsObj.opts);
      return tabsObj;
    };

    /**
     * [addItem description]
     * @param {[String, DOM, jQuery]} content [description]
     * @param {[String]} {[Optional]} title   [description]
     * @param {[Integer]} {[Optional]} index   [description]
     * @return {[Tabs]} [description]
    */


    Tabs.prototype.addItem = function(content, title, index) {
      var contentObj, contentTarget, insertFunc, itemTarget, opts, self, tabsObj;
      tabsObj = this;
      self = tabsObj.jqObj;
      opts = tabsObj.opts;
      contentObj = $(content);
      if (title == null) {
        title = contentObj.attr('title');
      }
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

    /**
     * [activate description]
     * @param  {[Integer]} {[Optional]} index [description]
     * @return {[Tabs]}       [description]
    */


    Tabs.prototype.activate = function(index) {
      var opts, self, tabsObj;
      tabsObj = this;
      self = tabsObj.jqObj;
      opts = tabsObj.opts;
      if (arguments.length === 0) {
        return opts.activateIndex;
      }
      $('>.uiTitleBar >.uiListContent .uiTabsItem', self).eq(index).trigger('click.uiTabs');
      return tabsObj;
    };

    /**
     * [item description]
     * @param  {[Integer]} {[Optional]} index   [description]
     * @param  {[String]} {[Optional]} content [description]
     * @param  {[String]} {[Optional]} title   [description]
     * @return {[jQuery, Tabs]}         [description]
    */


    Tabs.prototype.item = function(index, content, title) {
      var item, opts, self, tabsObj, titleBar;
      tabsObj = this;
      self = tabsObj.jqObj;
      opts = tabsObj.opts;
      if (index == null) {
        index = 0;
      }
      item = $('>.uiTabsContent', self).eq(index);
      titleBar = $('> .uiTabsList > .uiListContent > .uiTabsItemContainer >.uiTabsItem', self).eq(index);
      if (typeof content === 'undefined') {
        return item;
      }
      if (content != null) {
        item.html(content);
      }
      if (typeof title === 'undefined') {
        return titleBar;
      }
      titleBar.html(title);
      return tabsObj;
    };

    return Tabs;

  })($$.Widget);

  /**
   * [initTabs description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


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
      if ($.isArray(opts.titleList)) {
        title = opts.titleList[n];
      }
      if (title == null) {
        title = content.attr('title');
      }
      $(opts.tabsItemHTML).html(title + closeHTML).appendTo($('>.uiListContent >.uiTabsItemContainer', titleBarObj));
      return opts.tabsItemTotal++;
    });
    self.prepend(titleBarObj);
    tabsItemList = $('> .uiTabsList > .uiListContent .uiTabsItem', self);
    if (opts.tabsItemWidth > 0) {
      tabsItemList.width(opts.tabsItemWidth);
    }
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
    initEvent(self, opts);
    return null;
  };

  /**
   * [initEvent description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


  initEvent = function(self, opts) {
    $('> .uiTabsList > .uiListContent > .uiTabsItemContainer', self).on('click.uiTabs', function(e) {
      var content, index, nextObj, obj, target;
      target = $(e.target);
      if (target.hasClass('uiCloseItemBtn')) {
        obj = target.parent('.uiTabsItem');
        if ((opts.close(self, obj, e)) === false) {
          return false;
        }
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
        if ((opts.change(self, target, content, e)) === false) {
          return false;
        }
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
        if ((opts[clickFunc](self, target, e)) === false) {
          return false;
        }
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
    $('> .uiTabsList > .uiListContent > .uiTabsItemContainer > .uiTabsItem', self).hover(function() {
      return $(this).addClass(opts.tabsItemHoverClass);
    }, function() {
      return $(this).removeClass(opts.tabsItemHoverClass);
    });
    return null;
  };

  /**
   * [checkItemViewStatus description]
   * @param  {[jQuery]} self [description]
   * @param  {[Object]} opts [description]
  */


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
      arrowLeftObj.hide();
    } else {
      arrowLeftObj.show();
    }
    return null;
  };

}).call(this);
