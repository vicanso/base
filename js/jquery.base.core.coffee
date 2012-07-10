$$ = window.BASE = window.BASE || {}
$ = window.jQuery
class RandomString
  ###*
   * [constructor 用于生成随机字符串（用于标识Widget ID）]
   * @param  {[String]} {[Optional]} legalCharList [随机的字符串集]
   * @return {[RandomString]} [返回RandomString对象]
  ###
  constructor :(legalCharList) ->
    defaultLegalChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if(legalCharList)
      @legalCharList = legalCharList.split ""
    else
      @legalCharList = defaultLegalChar.split ""
    @legalListLength = @legalCharList.length
  ###*
   * [getRandomStr 获取随机字符串]
   * @param  {[Integer]} {[Optional]} len [指定随机字符串的长度]
   * @return {[String]}     [返回随机字符串]
  ###
  getRandomStr :(len) ->
    len ?= 10
    (@getRandomChar num for num in [1..10]).join ""
  ###*
   * [getRandomChar 获取随机字符]
   * @return {[Char]} [返回一个随机字符]
  ###
  getRandomChar :() ->
    @legalCharList[Math.floor Math.random() * @legalListLength]

$.extend $$, {
  version :"0.8.1"
  msie6 :$.browser.msie && $.browser.version == "6.0"
  defaultAnimateDuration :300
  defaultBorder :"uiBlueBorder"
  defaultBoxShadow :"uiBlueBoxShadow"
  defaultGradientBG :"uiBlueGradientBG"
  hoverGradientBG :"uiLightBlueGradientBG"
  selectedGradientBG :"uiRedGradientBG"
  cssShow :
    position:"absolute"
    visibility:"hidden"
    display:"block"
  
  widgetType :
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
  ###*
   * [widgetDictionary 保存Widget对象的Map结构]
   * @type {Object}
  ###
  widgetDictionary :{}
  ###*
   * [randomKey RandomString的实例，用于返回随机的Widget ID]
   * @type {RandomString}
  ###
  randomKey :new RandomString()
  ###*
   * [getWidget 获取Widget对象]
   * @param  {[String]} key [Widget对象ID]
   * @return {[Widget]}     [Widget对象]
  ###
  getWidget :(key) ->
    widget = @widgetDictionary[key]
    return widget if widget?
  ###*
   * [addWidget 添加Widget对象到widgetDictionary中]
   * @param {[String]} key    [Widget对象的ID]
   * @param {[Widget]} widget [Widget对象]
  ###
  addWidget :(key, widget) ->
    @widgetDictionary[key] = widget if key? and widget?
  ###*
   * [removeWidget 删除Widget对象]
   * @param  {[String]} key [Widget对象的ID]
   * @return {[Boolean]}     [删除结果]
  ###
  removeWidget :(key) ->
    widget = @widgetDictionary[key]
    @widgetDictionary[key] = null if not delete @widgetDictionary[key]
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
  ###*
   * [getRandomKey 获取随机字符串]
   * @param  {[Integer]} length [字符串长度]
   * @return {[String]}        [返回该长度的随机字符串]
  ###
  getRandomKey :(length) ->
    @randomKey.getRandomStr length
  ###*
   * [createWidgetByJQuery 通过jQuery方法创建Widget对象]
   * @return {[Widget]} [返回jQuery对象]
  ###
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
