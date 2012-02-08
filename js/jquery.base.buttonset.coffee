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
  clickButton : (index) ->
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
    obj = self.children().eq index
    hasStatus = false
    $.each ('uiCheckBox uiRadio uiImgRadio uiImgCheckBox'.split ' '), (n, value) ->
      if obj.hasClass value
        hasStatus = true
        return false
    if not hasStatus
      return false
    if arguments.length < 2
      if obj.hasClass opts.buttonSelectedClass
        return true
      return false
    if checked is true
      if not obj.hasClass opts.buttonSelectedClass
        obj.trigger 'click.uiButtonSet'
    else
      if obj.hasClass opts.buttonSelectedClass
        (obj.removeClass opts.buttonSelectedClass).addClass opts.buttonClass
    return buttonSetObj
  removeButton : (index) ->
    buttonSetObj = @
    self = buttonSetObj.jqObj
    opts = buttonSetObj.opts
    index ?= 0
    if $.isArray opts.iconArray
      opts.iconArray.splice index, 1
    return ((self.children '.uiButton').eq index).remove()

initButtonSet = (self, opts) ->
  opts.statusClass = {}
  groupStr = ''
  switch opts.buttonSetType
    when 'radio'
      buttonTypeClass = 'uiRadio'
      groupStr = $$.getRandomKey 5
    when 'checkBox'
      buttonTypeClass = 'uiCheckBox'
    when 'imageRadio'
      buttonTypeClass = 'uiImgRadio'
      groupStr = $$.getRandomKey 5
    when 'imageCheckBox'
      buttonTypeClass = 'uiImgCheckBox'
    else
      buttonTypeClass = ''
  (self.addClass 'uiButtonSet uiWidget uiNoSelectText').children().each (n) ->
    obj = ($ @).addClass buttonTypeClass
    if groupStr.length isnt 0
      obj.attr 'group', groupStr
    if opts.buttonMargin > 0
      buttonClass = "uiButton uiCornerAll #{opts.buttonClass} #{opts.buttonBorderClass}"
    else
      buttonClass = "uiButton #{opts.buttonClass}"
    if obj.hasClass 'uiImgRadio' or obj.hasClass 'uiImgCheckBox'
      (obj.wrapInner '<span />').prepend opts.imgIconHTML
    if n isnt 0
      if opts.buttonMargin > 0
        marginAttr
        if opts.vertical is true
          marginAttr = 'marginTop'
        else
          marginAttr = 'marginLeft'
        obj.css marginAttr, opts.buttonMargin
      else
        if opts.vertical is true
          buttonClass += " uiBorderTop #{opts.buttonBorderClass}"
        else
          buttonClass += " uiBorderLeft #{opts.buttonBorderClass}"
    obj.addClass buttonClass
    if $.isArray opts.iconArray
      index = n
      floatClass = ''
      if index >= opts.iconArray.length
        index = opts.iconArray.length - 1
      if $.isArray opts.iconFloatArray
        if n >= opts.iconFloatArray.length
          floatClass = opts.iconFloatArray[opts.iconFloatArray.length - 1]
        else
          floatClass = opts.iconFloatArray[n]
        obj.wrapInner '<span />'
        if floatClass is 'right'
          floatClass = 'uiIconFloatRight'
        else
          floatClass = ''
      (obj.wrapInner '<span />').prepend "<span class=\"uiIcon #{opts.iconArray[index]} #{floatClass}\"></span>"
    if opts.buttonWidth isnt 0
      obj.width opts.buttonWidth
  if opts.buttonMargin is 0
    self.addClass "#{opts.buttonSetClass} #{opts.buttonSetBorderClass}"
  if opts.vertical
    self.width self.children().outerWidth true
  initEvent self, opts
  if opts.defaultSelectedItem > -1
    changeButtonStatus (self.children().eq opts.defaultSelectedItem), opts
  return null
initEvent = (self, opts) ->
  mouseDownFlag = false
  jQueryEvent =  if self.off then 'on' else 'bind'
  (self.children '.uiButton, .uiImgButton')[jQueryEvent] 'mouseenter.uiButtonSet mouseleave.uiButtonSet mousedown.uiButtonSet mouseup.uiButtonSet click.uiButtonSet', (e) ->
    obj = $ @
    if e.type is 'click'
      if (opts.click self, obj, e) is false
        return
      changeButtonStatus obj, opts
    switch e.type
      when 'mouseenter'
        setStatusClass obj, opts, opts.buttonHoverClass
      when 'mouseleave'
        removeStatusClass obj, opts, opts.buttonHoverClass
      when 'mousedown'
        setStatusClass obj, opts, opts.buttonPressClass
      when 'mouseup'
        removeStatusClass obj, opts, opts.buttonPressClass
  return null
changeButtonStatus = (obj, opts) ->
  if (obj.hasClass 'uiRadio') or obj.hasClass 'uiImgRadio'
    group = obj.attr 'group'
    siblingsObj = obj.siblings "[group=\"#{group}\"]"
    (obj.removeClass "#{opts.buttonHoverClass} #{opts.buttonClass}").addClass opts.buttonSelectedClass
    (siblingsObj.removeClass opts.buttonSelectedClass).addClass opts.buttonClass
    if obj.hasClass 'uiImgRadio'
      (((obj.addClass 'uiImgRadioChecked').children '.uiIcon').removeClass 'uiUnCheckedButtonIcon').addClass 'uiCheckedButtonIcon'
      (((siblingsObj.removeClass 'uiImgRadioChecked').children '.uiIcon').removeClass 'uiCheckedButtonIcon').addClass 'uiUnCheckedButtonIcon'
  else if (obj.hasClass 'uiCheckBox') or obj.hasClass 'uiImgCheckBox'
    if opts.statusClass[opts.buttonHoverClass] is null
      (obj.toggleClass opts.buttonSelectedClass).toggleClass opts.buttonClass
    else if opts.statusClass[opts.buttonHoverClass] isnt opts.buttonSelectedClass
      (obj.removeClass opts.buttonHoverClass).addClass opts.buttonSelectedClass
    else
      (obj.removeClass opts.buttonHoverClass).addClass opts.buttonClass
    if obj.hasClass 'uiImgCheckBox'
      ((obj.toggleClass 'uiImgCheckBoxChecked').children '.uiIcon').toggleClass 'uiCheckedButtonIcon uiUnCheckedButtonIcon'
  else
    (obj.removeClass opts.buttonHoverClass).addClass opts.buttonClass
  $.each opts.statusClass, (key, value) ->
    opts.statusClass[key] = null
setOriginClass = (obj, opts, statusClass) ->
  $.each [opts.buttonClass, opts.buttonSelectedClass, opts.buttonHoverClass, opts.buttonPressClass], (n, value) ->
    if obj.hasClass value
      opts.statusClass[statusClass] = value
    obj.removeClass value
getOriginClass = (obj, opts, statusClass) ->
  if opts.statusClass[statusClass] is null
    return
  $.each [opts.buttonClass, opts.buttonSelectedClass, opts.buttonHoverClass, opts.buttonPressClass], (n, value) ->
    obj.removeClass value
  obj.addClass opts.statusClass[statusClass]
setStatusClass = (obj, opts, statusClass) ->
  setOriginClass obj, opts, statusClass
  obj.addClass statusClass
removeStatusClass = (obj, opts, statusClass) ->
  getOriginClass obj, opts, statusClass

