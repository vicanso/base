$$ = window.BASE = window.BASE || {}
$ = window.jQuery
class RandomString
  constructor :(legalCharList) ->
    defaultLegalChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if(legalCharList)
      @legalCharList = legalCharList.split ""
    else
      @legalCharList = defaultLegalChar.split ""
    @legalListLength = @legalCharList.length
  getRandomStr :(len) ->
    len ?= 10
    (@getRandomChar num for num in [1..10]).join ""
  getRandomChar :() ->
    @legalCharList[Math.floor Math.random * @legalListLength]

$.extend $$, {
  version :"0.8.1"
  msie6 :$.browser.msie && $.browser.version == "6.0"
  defaultAnimateDuration :300
  defaultBorder :"uiBlueBorder"
  defaultBoxShadow :"uiBlueBoxShadow"
  defaultGradientBG :"uiBlueGradientBG"
  hoverGradientBG :"uiLightBlueGradientBG"
  selectedGradientBG :"uiRedGradientBG"
  cssShow :{
    position:"absolute"
    visibility:"hidden"
    display:"block"
  }
  widgetType :{
    uiDialog :"dialog"
    uiTabs :"tabs"
    uiSlide :"slide"
    uiAccordion :"accordion"
    uiButtonSet :"buttonSet"
    uiDorpDownList :"dropDownList"
    uiProgressBar :"progressBar"
    uiTip :"tip"
    uiList :"list"
    uiDatePicker :"datePicker"
    uiTree :"tree"
    uiGrid :"grid"
  }
  widgetDictionary :{}
  randomKey :new RandomString()
  getWidget :(key) ->
    widget = @widgetDictionary[key]
    return widget if widget?
  addWidget :(key, widget) ->
    @widgetDictionary[key] = widget if key? and widget?
  removeWidget :(key) ->
    widget = @widgetDictionary[key]
    @widgetDictionary[key] = null if notdelete @widgetDictionary[key]
    opts = widget.opts if widget?
    for prop of opts
      if opts.hasOwnProperty prop
        if not (delete opts[prop])
          opts[prop] = null

    for prop of widget
      if widget.hasOwnProperty prop
        if not (delete widget[prop])
          widget[prop] = null
    return true
  getRandomKey :(length) ->
    @randomKey.getRandomStr length
  inherit :(subClass, superClass, subFunction) ->
    if not($.isFunction subClass) or not($.isFunction superClass)
      $.error "继承出错"
    tmpClass = () ->
    tmpClass.prototype = superClass.prototype
    subClass.prototype = new tmpClass()
    subClass.prototype.constructor = subClass
    subClass.prototype.superClass = superClass
    $.extend subClass.prototype, subFunction
    return true
  createWidgetByJQuery :() ->
    self = this
    args = Array.prototype.slice.call(arguments)
    constructor = args.pop()
    options = args[0]
    if typeof options is "string"
      widgetKey = self.attr "widget"
      if widgetKey?
        widgetObj = $$.getWidget widgetKey
        return widgetObj.selectHandle.apply widgetObj, args
    else
      widgetObj = new constructor self, options
    return self
}