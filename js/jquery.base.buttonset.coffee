$ = window.jQuery
$$ = window.BASE

$.fn.buttonSet = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.ButtonSet
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.ButtonSet extends $$.Widget
  constructor: (self, options) ->
    buttonSetObj = @
    if not (buttonSetObj instanceof $$.ButtonSet)
      return new $$.ButtonSet self, options
    opts = $.extend {}, $$.ButtonSet.prototype.defaults, options
    buttonSetObj.constructor.__super__.constructor.call buttonSetObj, self, opts
    buttonSetObj.init();
  defaults : {
    buttonSetClass : "#{$$.defaultBoxShadow} uiCornerAll"
    buttonSetType : ''
    buttonSetGroup : ''
    buttonClass : $$.defaultGradientBG
    buttonSetBorderClass : $$.defaultBorder
    buttonBorderClass : 'uiGreyBorder'
    buttonHoverClass : $$.hoverGradientBG
    buttonSelectedClass : "#{$$.selectedGradientBG} uiActive"
    buttonPressClass : "#{$$.hoverGradientBG} uiButtonPressed"
    buttonWidth : 0
    buttonMargin : 0
    iconArray : null
    iconFloatArray : null
    defaultSelectedItem : -1
    vertical : false

    statusClass : ''
    imgIconHTML : '<div class="uiIcon uiUncheckedButtonIcon"></div>'

    click : $.noop
  }
  init : () ->
    buttonSetObj = @
    buttonSetObj.createWidget()
    initButtonSet buttonSetObj.jqObj, buttonSetObj.opts
    return buttonSetObj
  click : (index) ->
    buttonSetObj = @
    self = buttonSetObj.jqObj
    opts = buttonSetObj.opts
    index ?= 0
    obj = (self.children().eq index).click()
    return buttonSetObj
  button : (index) ->
    buttonSetObj = @
    self = buttonSetObj.jqObj
    opts = buttonSetObj.opts
    index ?= 0
    return self.children().eq index
  buttonText : (index, text) ->
    buttonSetObj = @
    self = buttonSetObj.jqObj
    opts = buttonSetObj.opts
    index ?= 0
    obj = self.children().eq index
    if arguments.length isnt 2
      return obj.text()
    iconObj = obj.children '.uiIcon'
    (obj.html text).prepend iconObj
    return buttonSetObj
  buttonIcon : (index, icon) ->
    buttonSetObj = @
    self = buttonSetObj.jqObj
    opts = buttonSetObj.opts
    index ?= 0
    if not $.isArray opts.iconArray
      return ''
    obj = self.children().eq index
    iconArrayTotal = opts.iconArray.length - 1
    if index > iconArrayTotal
      index = iconArrayTotal
    iconClass = opts.iconArray[index]
    if arguments.length < 2
      return iconClass
    ((obj.children '.uiIcon').removeClass iconClass).addClass icon
    opts.iconArray[index] = icon
    return buttonSetObj
  val : (index, checked) ->
    buttonSetObj = @
    self = buttonSetObj.jqObj
    opts = buttonSetObj.opts
    index ?= 0