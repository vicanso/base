$$ = window.BASE = window.BASE || {}
$ = window.jQuery

class $$.Widget
  constructor : (self, options) ->
    widgetObj = @
    if not (widgetObj instanceof $$.Widget)
      return new $$.Widget self, options
    widgetObj.jqObj = self
    widgetObj.opts = {}
    $.extend widgetObj.opts, $$.Widget.prototype.defaults, options
  defaults : {
    widgetKey : null
    animateTime: $$.defaultAnimateDuration
    disabled : false
    minPosition: "bottom"
    clone : null
    }
  selectHandle : () ->
    args = Array.prototype.slice.call arguments
    widgetObj = @
    func = args.shift()
    if ($.isFunction widgetObj[func])
      return widgetObj[func].apply widgetObj, args
    return null
  self : () ->
    return @jqObj
  createWidget : () ->
    widgetObj = @
    opts = widgetObj.opts
    self = widgetObj.jqObj
    opts.clone = self.clone()
    opts.widgetKey = $$.getRandomKey()
    self.attr 'widget', opts.widgetKey
    widgetObj.widget opts.widgetKey, widgetObj
    return widgetObj
  widget : () ->
    if arguments.length is 2
      return $$.addWidget arguments[0], arguments[1]
    else if arguments.length is 1
      return $$.getWidget arguments[0]
    return @
  removeWidget : (key) ->
    if key?
      $$.removeWidget key
    return true
  disable : () ->
    widgetObj = @
    widgetObj.opts.disabled = true
    widgetObj.jqObj.addClass 'uiWidgetDisalbed'
    return widgetObj
  enable : () ->
    widgetObj = @
    widgetObj.opts.disabled = false
    widgetObj.jqObj.removeClass 'uiWidgetDisalbed'
    return widgetObj
  destroy : (revert) ->
    widgetObj = @
    self = widgetObj.jqObj
    opts = widgetObj.opts
    (self.find '.uiWidget').each ()->
      obj = $ @
      key = obj.attr 'widget'
      widget = widgetObj.widget key
      if widget?
        widgetDestroy widget, revert
      return true
    widgetDestroy widgetObj revert
    return widgetObj

widgetDestroy = (widget, revert) ->
  self = widget.jqObj
  opts = widget.opts
  if not (self.hasClass 'uiWidget')
    self = opts.targetWidget
  if(self.hasClass 'uiDraggable') or (self.find '.uiDraggable').length isnt 0
      self.draggable 'destroy'
  if (self.find '.uiResizable').length isnt 0
      self.resizable 'destroy'
  if $.isFunction widget.beforeDestroy
      widget.beforeDestroy()
  widgetKey = (self.removeClass 'uiWidget').attr 'widget'
  widget.removeWidget widgetKey
  if revert
    opts.clone.insertAfter self
  self.remove()
  delete opts.clone
  opts = null
