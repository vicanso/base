(function() {
  var $, $$, initDialog, initEvent,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  $$ = window.BASE;

  $.fn.dialog = function(options) {
    var args, result, self;
    self = this;
    args = Array.prototype.slice.call(arguments);
    args.push($$.Dialog);
    result = $$.createWidgetByJQuery.apply(self, args);
    if ((result.jqObj != null) && options !== 'widget') return self;
    return result;
  };

  $$.Dialog = (function(_super) {

    __extends(Dialog, _super);

    Dialog.name = 'Dialog';

    function Dialog(self, options) {
      var dialogObj, opts;
      dialogObj = this;
      if (!(dialogObj instanceof $$.Dialog)) return new $$.Dialog(self, options);
      opts = $.extend({}, $$.Dialog.prototype.defaults, options);
      dialogObj.constructor.__super__.constructor.call(dialogObj, self, opts);
      dialogObj.init();
    }

    Dialog.prototype.defaults = {
      dialogClass: "" + $$.defaultBorder + " uiCornerAll " + $$.defaultBoxShadow,
      titleBarClass: $$.defaultGradientBG,
      position: null,
      zIndex: 1000,
      draggable: false,
      resizable: false,
      minStatusWidth: 250,
      modal: false,
      buttonSet: null,
      minHeight: 300,
      maxHeight: 700,
      minWidth: 400,
      maxWidth: 1000,
      active: true,
      minimize: false,
      closable: true,
      noTitleBar: false,
      titleIcon: '',
      title: '',
      controlButton: true,
      autoOpen: true,
      destroyOnClose: true,
      closeAnimate: 'slideUp',
      openAnimate: 'slideDown',
      beforeClose: $.noop,
      close: $.noop,
      beforeOpen: $.noop,
      open: $.noop,
      beforeMin: $.noop,
      min: $.noop,
      beforeResume: $.noop,
      resume: $.noop,
      dragStart: $.noop,
      draging: $.noop,
      dragStop: $.noop,
      resizeStart: $.noop,
      resizing: $.noop,
      resizeStop: $.noop,
      minStatusHeight: 0,
      originHeight: 0,
      originWidth: 0,
      originPosition: null,
      overflowStatus: null,
      controlButtonSetHTML: '<div class="uiDialogButtonSet"><div class="uiUserBtn uiMinBtn uiIcon uiMinButtonIcon"></div><div class="uiUserBtn uiCloseBtn uiIcon uiCloseButtonIcon"></div></div>',
      titleBarHTML: '<div class="uiTitleBar"><div class="uiTitle"></div></div>',
      contentHTML: '<div class="uiContent"></div>',
      resizeHTML: '<div class="uiResizable"></div>',
      selectList: null
    };

    Dialog.prototype.init = function() {
      var dialogObj;
      dialogObj = this;
      dialogObj.createWidget();
      initDialog(dialogObj, dialogObj.jqObj, dialogObj.opts);
      return dialogObj;
    };

    Dialog.prototype.title = function(title) {
      var dialogObj, obj, opts, self;
      dialogObj = this;
      self = dialogObj.jqObj;
      opts = dialogObj.opts;
      obj = $('>.uiTitleBar >.uiTitle', self);
      if (arguments.length === 0) return obj.text();
      opts.title = title;
      return obj.html(obj.html().replace(obj.text(), title));
    };

    Dialog.prototype.titleIcon = function(titleIcon) {
      var dialogObj, obj, opts, self;
      dialogObj = this;
      self = dialogObj.jqObj;
      opts = dialogObj.opts;
      if (arguments.length === 0) return opts.titleIcon;
      if (opts.titleIcon === '') {
        ($('>.uiTitleBar >.uiTitle', self)).prepend('<span class="uiTitleIcon" />');
      }
      obj = (($('>.uiTitleBar >.uiTitle >.uiTitleIcon', self)).removeClass(opts.titleIcon)).addClass(titleIcon);
      opts.titleIcon = titleIcon;
      return dialogObj;
    };

    Dialog.prototype.content = function(content) {
      var contentObj, dialogObj, opts, self;
      dialogObj = this;
      self = dialogObj.jqObj;
      opts = dialogObj.opts;
      contentObj = self.children('.uiContent');
      if (arguments.length === 0) return contentObj;
      contentObj.empty().append($(content));
      return dialogObj;
    };

    return Dialog;

  })($$.Widget);

  initDialog = function(dialogObj, self, opts) {
    var buttonSetHTML, buttonSetObj, contentObj, controlButton, key, maskObj, titleBar, titleBarClass, value, _ref;
    titleBarClass = "" + opts.titleBarClass + " uiCornerAll";
    if (opts.title === '') opts.title = self.attr('title' || '');
    if (opts.draggable) titleBarClass += ' uiDraggable';
    if (opts.controlButton) {
      controlButton = $(opts.controlButtonSetHTML);
      if (!opts.minimize) (controlButton.children('.uiMinBtn')).hide();
      if (!opts.closable) (controlButton.children('.uiCloseBtn')).hide();
    }
    contentObj = self.children().addClass('uiContent');
    if (!opts.noTitleBar) {
      titleBar = ((((($(opts.titleBarHTML)).addClass(titleBarClass)).append(controlButton)).children('.uiTitle')).html(opts.title)).end();
      if (opts.titleIcon !== null) {
        ((titleBar.children('.uiTitle')).prepend($('<span class="uiTitleIcon" />'))).addClass(opts.titleIcon);
      }
      self.prepend(titleBar);
    }
    self.addClass("uiDialog uiWidget " + opts.dialogClass);
    if (opts.position !== null) {
      (self.css('zIndex', opts.zIndex + 1)).moveToPos(opts.position);
    }
    if (opts.modal) {
      maskObj = (($('<div />')).addClass('uiMask')).appendTo('body');
      if (opts.position === null) {
        (self.css('zIndex', opts.zIndex + 1)).moveToPos({
          position: 'center'
        });
      }
      if ($$.msie6) {
        opts.selectList = ($('select:visible')).filter(function() {
          if (($(this)).css('visibility' !== 'hidden')) return true;
        });
        opts.selectList.css('visibility', 'hidden');
        maskObj.height(($(document)).height());
      }
    }
    if (opts.buttonSet !== null) {
      buttonSetHTML = '<div>';
      _ref = opts.buttonSet;
      for (key in _ref) {
        value = _ref[key];
        buttonSetHTML += '<div>' + key + '</div>';
      }
      buttonSetHTML += '</div>';
      buttonSetObj = ($(buttonSetHTML)).buttonSet({
        click: function(target) {
          if ((opts.buttonSet[target.text()](this)) === false) return false;
          return dialogObj.close(self, opts, target);
        }
      });
      buttonSetObj.appendTo(self);
    }
    if (opts.resizable) {
      self.append(opts.resizeHTML);
      if (self.css('position' === 'static')) self.css('position', 'relative');
    }
    opts.minHeight = Math.min(self.height(), opts.minHeight);
    opts.minWidth = Math.min(self.width(), opts.minWidth);
    setContentHeight(self, opts);
    initEvent(dialogObj, self, opts);
    if (!opts.autoOpen) return self.hide();
  };

  initEvent = function(dialogObj, self, opts) {
    var dragStopFunction, jQueryEvent, posStr, resizeStopFunc;
    posStr = self.css('position');
    jQueryEvent = self.off ? 'on' : 'bind';
    (self.find('>.uiTitleBar >.uiDialogButtonSet >.uiUserBtn'))[jQueryEvent]('click.uiDialog', function(e) {
      var func, obj;
      obj = $(this);
      if (obj.hasClass('uiMinBtn')) {
        func = 'min';
      } else if (obj.hasClass('uiResumeBtn')) {
        func = 'resume';
      } else if (obj.hasClass('uiCloseBtn')) {
        func = 'close';
      }
      if (func != null) {
        if (self.is(':animated')) return false;
        dialogObj[func](self, opts, obj, e);
        return false;
      }
    });
    if (opts.draggable) {
      dragStopFunction = function(mask, offset) {
        if ((opts.dragStop(self)) === false) return false;
        return self.offset(offset);
      };
      self.draggable({
        event: {
          start: opts.dragStart,
          doing: opts.draging,
          stop: dragStopFunction
        }
      });
    }
    if (opts.resizable) {
      resizeStopFunc = function(mask, width, height) {
        var content, otherItemHeightTotal, outerOffset;
        if ((opts.resizeStop(self)) === false) return false;
        height = Math.min(Math.max(opts.minHeight, height), opts.maxHeight);
        width = Math.min(Math.max(opts.minWidth, width), opts.maxWidth);
        otherItemHeightTotal = 0;
        content = ((self.width(width)).height(height)).children('.uiContent');
        self.children().each(function() {
          var obj;
          obj = $(this);
          if (!obj.hasClass('uiContent' && (!obj.hasClass('uiResizable')))) {
            return otherItemHeightTotal += obj.outerHeight(true);
          }
        });
        outerOffset = content.outerHeight(true - content.height());
        return content.height(height - otherItemHeightTotal - outerOffset);
      };
      return self.resizable({
        event: {
          start: opts.resizeStart,
          doing: opts.resizing,
          stop: resizeStopFunc
        },
        minHeight: opts.minHeight,
        maxHeight: opts.maxHeight,
        minWidth: opts.minWidth,
        maxWidth: opts.maxWidth
      });
    }
  };

}).call(this);
