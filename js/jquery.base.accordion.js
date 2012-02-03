(function() {
  var $, $$, initAccordion, initEvent,
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
      var accordionObj, opts;
      accordionObj = this;
      if (!(accordionObj instanceof $$.Accordion)) {
        return new $$.Accordion(self, options);
      }
      opts = $.extend({}, $$.Accordion.prototype.defaults, options);
      accordionObj.constructor.__super__.constructor.call(accordionObj, self, opts);
      accordionObj.init();
    }

    Accordion.prototype.defaults = {
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
          if (($(this)).hasClass(opts.activeClass)) return activateArr.push(n);
        });
        return activateArr;
      }
      obj = ($('> .uiTitleBar', self)).eq(index);
      if (!obj.hasClass(opts.activeClass)) obj.trigger(opts.event);
      return accordionObj;
    };

    Accordion.prototype.item = function(index, content, title) {
      var accordionObj, contentObj, opts, self, titleBarObj;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      if (index == null) index = 0;
      titleBarObj = ($('> .uiTitleBar', self)).eq(index);
      contentObj = titleBarObj.next();
      if (arguments.length === 1) return contentObj;
      if (arguments.length === 2) {
        if (content != null) {
          contentObj.html(content);
          return accordionObj;
        }
        return titleBarObj;
      }
      (titleBarObj.children('.uiTitle')).html(title);
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
      titleBarObj = (((($(opts.itemTitleBarHTML)).addClass(opts.itemTitleBarClass)).children('.uiTitle')).html(title)).end();
      (itemObj.addClass('uiContent uiHidden')).height(opts.height);
      if (arguments.length === 2) {
        obj = ($('> .uiTitleBar', self)).eq(index);
        titleBarObj.insertBefore(obj);
        itemObj.insertBefore(obj);
      } else {
        (self.append(titleBarObj)).append(itemObj);
      }
      return accordionObj;
    };

    Accordion.prototype.removeItem = function(index) {
      var accordionObj, opts, self;
      accordionObj = this;
      self = accordionObj.jqObj;
      opts = accordionObj.opts;
      if (index == null) index = 0;
      return (($('>.uiTitleBar', self)).eq(index)).next().andSelf().remove();
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
        ($('>.uiAccordionTitleBar', self)).prepend($('<span class="uiTitleIcon" />'));
      }
      obj = (($('> .uiAccordionTitleBar > span.uiTitleIcon', self)).removeClass(opts.titleIcon)).addClass(titleIcon);
      opts.titleIcon = titleIcon;
      return accordionObj;
    };

    return Accordion;

  })($$.Widget);

  initAccordion = function(self, opts) {
    var title, titleBar;
    title = opts.title || self.attr('title');
    if (title != null) {
      titleBar = (((($(opts.titleBarHTML)).addClass(opts.titleBarClass)).children('.title')).html(title)).end();
      if (opts.titleIcon != null) {
        (titleBar.prepend($('<span class="uiTitleIcon" />'))).addClass(opts.titleIcon);
      }
    }
    ((self.addClass('uiAccordion uiWidget ' + opts.accordionClass)).children('div')).each(function(n) {
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
      itemTitleBarObj = ($(opts.itemTitleBarHTML)).addClass(titleBarClass);
      (((itemTitleBarObj.children('.uiUserBtn')).toggleClass(buttonClass)).siblings('.uiTitle')).html(title);
      return itemTitleBarObj.insertBefore((obj.addClass("uiContent " + contentClass)).height(opts.height));
    });
    self.prepend(titleBar);
    return initEvent(self, opts);
  };

  initEvent = function(self, opts) {
    var jQueryEvent;
    jQueryEvent = self.off ? 'on' : 'bind';
    return self[jQueryEvent]("" + opts.event + ".uiAccordion", function(e) {
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
      selectedList = opts.hideOthers === true ? ((($(">.uiTitleBar." + opts.activeClass, self)).not(target)).removeClass("" + opts.activeClass + " uiActive")).addClass(opts.itemTitleBarClass) : null;
      changeObjList = (target.toggleClass("" + opts.itemTitleBarClass + " " + opts.activeClass + " uiActive")).add(selectedList);
      (changeObjList.children('.uiUserBtn')).toggleClass('uiArrowUpIcon uiArrowDownIcon');
      return ((changeObjList.next('.uiContent')).stop(true, true))[opts.animation](opts.animateTime, function() {
        if (($(this)).is(':visible')) opts.change(self, target, e);
        return opts.animating = false;
      });
    });
  };

}).call(this);
