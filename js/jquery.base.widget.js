(function() {
  var $, $$, widgetDestroy;

  $$ = window.BASE = window.BASE || {};

  $ = window.jQuery;

  $$.Widget = (function() {

    Widget.name = 'Widget';

    function Widget(self, options) {
      var widgetObj;
      widgetObj = this;
      if (!(widgetObj instanceof $$.Widget)) return new $$.Widget(self, options);
      widgetObj.jqObj = self;
      widgetObj.opts = {};
      $.extend(widgetObj.opts, $$.Widget.prototype.defaults, options);
    }

    Widget.prototype.defaults = {
      widgetKey: null,
      animateTime: $$.defaultAnimateDuration,
      disabled: false,
      minPosition: "bottom",
      clone: null
    };

    Widget.prototype.selectHandle = function() {
      var args, func, widgetObj;
      args = Array.prototype.slice.call(arguments);
      widgetObj = this;
      func = args.shift();
      if ($.isFunction(widgetObj[func])) {
        return widgetObj[func].apply(widgetObj, args);
      }
      return null;
    };

    Widget.prototype.self = function() {
      return this.jqObj;
    };

    Widget.prototype.createWidget = function() {
      var opts, self, widgetObj;
      widgetObj = this;
      opts = widgetObj.opts;
      self = widgetObj.jqObj;
      opts.clone = self.clone();
      opts.widgetKey = $$.getRandomKey();
      self.attr('widget', opts.widgetKey);
      widgetObj.widget(opts.widgetKey, widgetObj);
      return widgetObj;
    };

    Widget.prototype.widget = function() {
      if (arguments.length === 2) {
        return $$.addWidget(arguments[0], arguments[1]);
      } else if (arguments.length === 1) {
        return $$.getWidget(arguments[0]);
      }
      return this;
    };

    Widget.prototype.removeWidget = function(key) {
      if (key != null) $$.removeWidget(key);
      return true;
    };

    Widget.prototype.disable = function() {
      var widgetObj;
      widgetObj = this;
      widgetObj.opts.disabled = true;
      widgetObj.jqObj.addClass('uiWidgetDisalbed');
      return widgetObj;
    };

    Widget.prototype.enable = function() {
      var widgetObj;
      widgetObj = this;
      widgetObj.opts.disabled = false;
      widgetObj.jqObj.removeClass('uiWidgetDisalbed');
      return widgetObj;
    };

    Widget.prototype.destroy = function(revert) {
      var opts, self, widgetObj;
      widgetObj = this;
      self = widgetObj.jqObj;
      opts = widgetObj.opts;
      (self.find('.uiWidget')).each(function() {
        var key, obj, widget;
        obj = $(this);
        key = obj.attr('widget');
        widget = widgetObj.widget(key);
        if (widget != null) widgetDestroy(widget, revert);
        return true;
      });
      widgetDestroy(widgetObj(revert));
      return widgetObj;
    };

    return Widget;

  })();

  widgetDestroy = function(widget, revert) {
    var opts, self, widgetKey;
    self = widget.jqObj;
    opts = widget.opts;
    if (!(self.hasClass('uiWidget'))) self = opts.targetWidget;
    if ((self.hasClass('uiDraggable')) || (self.find('.uiDraggable')).length !== 0) {
      self.draggable('destroy');
    }
    if ((self.find('.uiResizable')).length !== 0) self.resizable('destroy');
    if ($.isFunction(widget.beforeDestroy)) widget.beforeDestroy();
    widgetKey = (self.removeClass('uiWidget')).attr('widget');
    widget.removeWidget(widgetKey);
    if (revert) opts.clone.insertAfter(self);
    self.remove();
    delete opts.clone;
    return opts = null;
  };

}).call(this);
