$ = window.jQuery
$$ = window.BASE
###*
 * [tip description]
 * @param  {[Object]} {[Optional]} options [description]
 * @return {[jQuery]}         [description]
###
$.fn.tip = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.Tip
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.Tip extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[Tip]}         [description]
  ###
  constructor: (self, options) ->
    tipObj = @
    if not (tipObj instanceof $$.Tip)
      return new $$.Tip self, options
    defaults =
      tipClass : 'uiCornerAll'
      borderColor : '#315389'
      backgroundColor : '#315389'
      backgroundClass : $$.defaultGradientBG
      target : null
      direction : 'top'
      arrowPositionValue : '40%'
      tipWidth : 0
      tipHeight : 0
      showAnimate : 'slideDown'
      hideAnimate : 'slideUp'
      beforeShow : $.noop
      show : $.noop
      beforeHide : $.noop
      hide : $.noop
      targetObj : null
      tipStyle : null
      arrowOffset : 10
      offset : null
      alawayshow : false,
      tipHTML : '<div></div><div></div>'
    
    opts = $.extend defaults, options
    tipObj.constructor.__super__.constructor.call tipObj, self, opts
    tipObj.init()
  ###*
   * [init description]
   * @return {[Tip]} [description]
  ###
  init : () ->
    tipObj = @
    tipObj.createWidget()
    initTip tipObj.jqObj, tipObj.opts
    return tipObj
  ###*
   * [content description]
   * @param  {[String]} {[Optional]} content       [description]
   * @param  {[Boolean]} {[Optional]} resetPosition [description]
   * @return {[Tip]}               [description]
  ###
  content : (content, resetPosition) ->
    tipObj = @
    self = tipObj.jqObj
    opts = tipObj.opts
    contentObj = self.children '.uiTipContent'
    if not content
      return contentObj
    contentObj.html content
    if resetPosition is true
      setPosition self, opts
    return tipObj
  ###*
   * [arrowPosition description]
   * @param  {[Integer]} {[Optional]} value [description]
   * @return {[Integer, Tip]}       [description]
  ###
  arrowPosition : (value) ->
    tipObj = @
    self = tipObj.jqObj
    opts = tipObj.opts
    arrowList = self.children '.uiTipArrowStyle1, .uiTipArrowStyle2'
    if arguments.length is 0
      return opts.positionValue
    if opts.tipStyle is 1
      arrowList.css 'left', value
    else
      arrowList.css 'top', value
    opts.positionValue = value
    return tipObj
  ###*
   * [beforeDestroy description]
   * @return {[Tip]} [description]
  ###
  beforeDestroy : () ->
    tipObj = @
    self = tipObj.jqObj
    opts = tipObj.opts
    opts.targetObj.off ".#{opts.widgetKey}"
    return tipObj
###*
 * [initTip description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initTip = (self, opts) ->
  opts.targetObj = $ opts.target
  tip = $ opts.tipHTML
  if opts.direction is 'top' or opts.direction is 'bottom'
    tip.addClass 'uiTipArrowStyle1'
    opts.tipStyle = 1
  else
    tip.addClass 'uiTipArrowStyle2'
    opts.tipStyle = 2
  contentObj = self.children()
  if contentObj.length is 0
    self.wrapInner '<div class="uiTipContent" />'
  else
    contentObj.addClass 'uiTipContent'
  self.addClass("uiTip uiWidget #{opts.tipClass}").prepend tip
  cssShow = 
    position : 'absolute'
    visibility : 'hidden'
    display : 'block'
  $.swap self[0], cssShow, () ->
    setPosition self, opts
  initEvent self, opts
  if opts.alawayshow is false
    self.hide()
  return null
###*
 * [initEvent description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initEvent = (self, opts) ->
  targetObj = opts.targetObj
  if opts.alawayshow is false
    if targetObj.length isnt 0
      targetObj.on "mouseenter.#{opts.widgetKey}", (e) ->
        target = $ @
        if (opts.beforeShow self, target, e) is false
          return false
        self.stop(true, true)[opts.showAnimate] opts.animateTime, ()->
          opts.show self, target, e
      targetObj.on "mouseleave.#{opts.widgetKey}", (e) ->
        target = $ @
        if (opts.beforeHide self, target, e) is false
          return false
        self.stop(true, true)[opts.hideAnimate] opts.animateTime, ()->
          opts.hide self, target, e
  return null
###*
 * [setPosition description]
 * @param {[jQuery]} self [description]
 * @param {[Object]} opts [description]
###
setPosition = (self, opts) ->
  targetObj = opts.targetObj
  if targetObj.length is 0
    return null
  targetObjOffset = targetObj.offset()
  leftValue = targetObjOffset.left
  topValue = targetObjOffset.top
  targetWidth = targetObj.outerWidth()
  targetHeight = targetObj.outerHeight()
  arrowList = self.children '.uiTipArrowStyle1, .uiTipArrowStyle2'
  arrow1 = arrowList.eq 0
  arrow2 = arrowList.eq 1
  setting = 
    top : 
      border : 'border-top-color'
      borderNone : 'border-bottom'
    bottom : 
      border : 'border-bottom-color'
      borderNone : 'border-top'
    left : 
      border : 'border-left-color'
      borderNone : 'border-right'
    right : 
      border : 'border-right-color'
      borderNone : 'border-left'
  if opts.tipWidth isnt 0
    self.width opts.tipWidth
    tipWidth = opts.tipWidth
  else
    tipWidth = self.width()
  if opts.tipHeight isnt 0
    self.height opts.tipHeight
  else
    tipHeight = self.height()
  self.css 'borderColor', opts.borderColor
  if opts.backgroundClass is null
    self.css 'backgroundColor', opts.backgroundColor
  else
    self.addClass opts.backgroundClass
  arrow1.css setting[opts.direction].border, opts.borderColor
  arrow2.css setting[opts.direction].border, opts.backgroundColor
  arrowList.css setting[opts.direction].borderNone, "none"
  arrow1TopValue = arrow2TopValue = arrow1LeftValue = arrow2LeftValue = opts.arrowPositionValue
  if opts.tipStyle is 1
    leftValue += (targetWidth / 2 - tipWidth / 2)
    arrow1TopValue = -opts.arrowOffset
    arrow2TopValue = arrow1TopValue + 1
    if opts.direction is 'bottom'
      topValue += (targetHeight + opts.arrowOffset)
    else if opts.direction is 'top'
      topValue -= (tipHeight + opts.arrowOffset)
      arrow1TopValue = tipHeight
      arrow2TopValue = arrow1TopValue - 1
  else
    arrow1LeftValue = tipWidth
    arrow2LeftValue = arrow1LeftValue - 1
    if opts.direction is 'left'
      leftValue -= (tipWidth + opts.arrowOffset)
    else if opts.direction is 'right'
      leftValue += (targetWidth + opts.arrowOffset)
      arrow1LeftValue = -opts.arrowOffset
      arrow2LeftValue = arrow1LeftValue + 1
  if $.isPlainObject opts.offset
    leftValue += (opts.offset.left || 0)
    topValue += (opts.offset.top || 0)
  self.css {
    left : leftValue
    top : topValue
  }
  arrow1.css {
    top : arrow1TopValue
    left : arrow1LeftValue
  }
  arrow2.css {
    top : arrow2TopValue
    left : arrow2LeftValue
  }
  return null