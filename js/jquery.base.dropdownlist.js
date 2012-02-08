(function() {
  var $, $$, initDropDownList, initEvent,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.dropDownList = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.DropDownList);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.DropDownList = (function(_super) {

    __extends(DropDownList, _super);

    DropDownList.name = 'DropDownList';

    function DropDownList(self, options) {
      var dropDownListObj, opts;
      dropDownListObj = this;
      if (!(dropDownListObj instanceof $$.DropDownList)) {
        return new $$.DropDownList(self, options);
      }
      opts = $.extend({}, $$.DropDownList.prototype.defaults, options);
      dropDownListObj.constructor.__super__.constructor.call(dropDownListObj, self, opts);
      dropDownListObj.init();
    }

    DropDownList.prototype.defaults = {
      dropDownListClass: "" + $$.defaultGradientBG + "  uiCornerAll " + $$.defaultBorder,
      selectListClass: "" + $$.defaultGradientBG + " uiCornerAll uiBlackBorder uiBlackBoxShadow",
      pageSize: 5,
      showAll: false,
      multiple: false,
      dropListType: 'normal',
      searchTip: '查找/search',
      hasScrollBar: false,
      listItemHoverClass: $$.hoverGradientBG,
      divideChar: ";",
      click: $.noop,
      change: $.noop,
      input: $.noop,
      blur: $.noop,
      focus: $.noop,
      selectItemTotal: 0,
      listItemOuterHeight: 0,
      dropDownHTML: '<div class="uiDropDown">\
                    <div class="uiDropDownBtn uiSmallIcon uiDropdownButtonIcon uiBlackBorder"></div>\
                </div>',
      selectListHTML: '<div class="uiSelectList"></div>',
      noListDataHTML: '<li style="font-size:12px;">无数据项..</li>'
    };

    DropDownList.prototype.init = function() {
      var dropDownListObj;
      dropDownListObj = this;
      dropDownListObj.createWidget();
      initDropDownList(dropDownListObj.jqObj, dropDownListObj.opts);
      return dropDownListObj;
    };

    DropDownList.prototype.selectedItem = function(index) {
      var dropDownListObj, opts, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      if (arguments.length === 0) return $('>.uiSelectList>.selected', self);
      ($("> .uiSelectList > li:eq(" + index + ")", self)).click();
      return dropDownListObj;
    };

    DropDownList.prototype.list = function(list) {
      var dropDownListObj, item, listItemObj, listShowTotal, opts, selectList, self, _i, _len;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      selectList = $('.uiSelectList', self);
      if (arguments.length === 0) return selectList.children();
      selectList.empty();
      if (typeof list === 'string') {
        selectList.html(list);
      } else if ($.isArray(list)) {
        if (list.length === 0) {
          selectList.append(opts.noListDataHTML);
        } else {
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            item = list[_i];
            selectList.append("<li>" + item + "</li>");
          }
        }
      } else {
        selectList.append(list);
      }
      listItemObj = selectList.find('>li');
      opts.selectItemTotal = listItemObj.length;
      if (opts.multiple) {
        listItemObj.prepend('<span class="uiSmallIcon uiSelectedIcon uiSelected"></span>');
      }
      listShowTotal = opts.pageSize;
      if (opts.showAll || opts.pageSize > opts.selectItemTotal) {
        listShowTotal = opts.selectItemTotal;
      }
      if (opts.listItemOuterHeight === 0) {
        opts.listItemOuterHeight = listItemObj.outerHeight(true);
      }
      selectList.height(opts.listItemOuterHeight * listShowTotal);
      ($('>.uiSelectList >li', self)).hover(function() {
        return ($(this)).addClass(opts.listItemHoverClass);
      }, function() {
        return ($(this)).removeClass(opts.listItemHoverClass);
      });
      return dropDownListObj;
    };

    DropDownList.prototype.showSelectList = function() {
      var dropDownListObj, opts, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      (self.children('.uiSelectList')).show();
      return dropDownListObj;
    };

    DropDownList.prototype.hideSelectList = function() {
      var dropDownListObj, opts, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      (self.children('.uiSelectList')).hide();
      return dropDownListObj;
    };

    DropDownList.prototype.val = function() {
      var dropDownListObj, opts, selectedValue, self;
      dropDownListObj = this;
      self = dropDownListObj.jqObj;
      opts = dropDownListObj.opts;
      selectedValue = [];
      (self.find('>.uiSelectList >.selected')).each(function() {
        return selectedValue.push(($(this)).text());
      });
      return selectedValue;
    };

    return DropDownList;

  })($$.Widget);

  initDropDownList = function(self, opts) {
    var dropDown, liItemList, multiple, selectList;
    multiple = opts.multiple ? 'uiMultiple' : '';
    selectList = self.children().addClass("" + multiple + " uiSelectList " + opts.selectListClass);
    liItemList = $('>li', selectList);
    opts.selectItemTotal = liItemList.length;
    dropDown = $(opts.dropDownHTML);
    if (opts.dropListType === 'search') {
      dropDown.append("<input type=\"text\" value=\"" + opts.searchTip + "\" class=\"uiCornerAll\" />");
    } else {
      dropDown.append('<span></span>');
    }
    if (opts.multiple) {
      liItemList.prepend('<span class="uiSmallIcon uiSelectedIcon uiSelected"></span>');
    }
    (self.prepend(dropDown)).addClass("uiDorpDownList uiWidget " + opts.dropDownListClass);
    if (opts.dropListType === 'search') {
      (dropDown.children('input')).width(dropDown.width() - 2 * (parseInt(dropDown.css('paddingLeft'))) - (dropDown.children('.uiDropDownBtn')).outerWidth(true));
    }
    if (opts.showAll) {
      opts.pageSize = opts.selectItemTotal;
    } else {
      opts.listItemOuterHeight = liItemList.outerHeight();
      selectList.height(opts.listItemOuterHeight * opts.pageSize);
    }
    selectList.hide();
    initEvent(self, opts);
    return null;
  };

  initEvent = function(self, opts) {
    var jQueryEvent, selectList, selectedContent;
    jQueryEvent = self.off ? 'on' : 'bind';
    selectedContent = $('> .uiDropDown > span, > .uiDropDown > input', self);
    ($('>.uiDropDown', self))[jQueryEvent]('click.uiDorpDownList', function(e) {
      var obj;
      obj = $(this);
      if ((opts.click(self, obj, e)) === false) return false;
      return (obj.siblings('.uiSelectList')).slideToggle(opts.animateTime);
    });
    selectList = $('>.uiSelectList', self);
    if (opts.hasScrollBar) {
      selectList.scrollBar();
    } else {
      selectList[jQueryEvent]('mousewheel.uiDorpDownList', function(e, delta) {
        var obj, showLiItem;
        obj = $(this);
        if (($('>li', obj)).length <= opts.pageSize) return;
        if (delta < 0) {
          showLiItem = $('>li:not(:hidden):first', obj);
          if ((showLiItem.nextAll('li')).length >= opts.pageSize) {
            showLiItem.hide();
          }
        } else {
          ($('>li:hidden:last', obj)).show();
        }
        return false;
      });
    }
    selectList[jQueryEvent]('click.uiDorpDownList', function(e) {
      var obj, propFunc, selectedValue, target;
      obj = $(this);
      target = $(e.target);
      propFunc = $.prop ? 'prop' : 'attr';
      if ((target[propFunc]('tagName')).toUpperCase() !== 'LI') {
        target = target.parent('li');
        if (target.length === 0) return;
      }
      selectedValue = (target.toggleClass('selected')).text();
      if (opts.multiple) {
        selectedValue = '';
        (obj.children('.selected')).each(function() {
          return selectedValue += ($(this)).text() + opts.divideChar;
        });
        selectedValue = selectedValue.substring(0, selectedValue.length - 1);
      } else {
        obj.slideUp();
      }
      if (opts.dropListType === 'search') {
        selectedContent.val(selectedValue);
      } else {
        selectedContent.html(selectedValue);
      }
      if ((opts.chage(self, obj, selectedValue, e)) === false) return false;
    });
    ($('> .uiSelectList > li', self)).hover(function() {
      return ($(this)).addClass(opts.listItemHoverClass);
    }, function() {
      return ($(this)).removeClass(opts.listItemHoverClass);
    });
    return null;
  };

}).call(this);
