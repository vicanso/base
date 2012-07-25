$ = window.jQuery
$$ = window.BASE
###*
 * [slide description]
 * @param  {[Object]} {[Optional]} options [description]
 * @return {[jQuery, Others]}         [description]
###
$.fn.slide = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.Slide
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.Slide extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[Slide]}         [description]
  ###
  constructor: (self, options) ->
    slideObj = @
    if not (slideObj instanceof $$.Slide)
      return new $$.Slide self, options
    defaults =
      mode : 'horizontal'
      slideClass : "#{$$.defaultGradientBG} uiCornerAll #{$$.defaultBorder}"
      sliderCrossClass : $$.hoverGradientBG
      slideClassVerticalMode : "uiBlackGradientBG uiBlackBorder uiCornerAll",
      sliderCrossClassVerticalMode : "uiBlueGradientBG"
      sliderClass : "uiBlackBorder uiDefaultSliderBG uiCornerAll"
      sliderLength : 8
      sliderTop : -5
      sliderLeft : -5
      noUserEvent : false
      userImageSlider : false
      min : 0
      max : 100
      step : 0.2
      animation : true
      click : $.noop
      slide : $.noop
      slideLength : 0
      slideValue : 0
      slideMax : 0
      slideBegin : 0
      panelHTML : '<div class="uiPanel"></div>'
      sliderCrossHTML : '<div class="uiSliderCross"></div>'
      sliderHTML : '<div class="uiSlider"></div>'
      slideDrag : false
    
    opts = $.extend defaults, options
    slideObj.constructor.__super__.constructor.call slideObj, self, opts
    slideObj.init()
  ###*
   * [init description]
   * @return {[Slide]} [description]
  ###
  init : () ->
    slideObj = @
    slideObj.createWidget()
    initSlide slideObj.jqObj, slideObj.opts
    return slideObj
  ###*
   * [val description]
   * @param  {[Integer]} {[Optional]} value   [description]
   * @param  {[Boolean]} {[Optional]} animate [description]
   * @return {[Slide]}         [description]
  ###
  val : (value, animate) ->
    slideObj = @
    self = slideObj.jqObj
    opts = slideObj.opts
    if arguments.length is 0
      return opts.slideValue
    if arguments.length is 1
      animate = true
    if not opts.slideDrag
      setSlide self, opts, value, animate, true
  ###*
   * [beforeDestroy description]
   * @return {[Slide]} [description]
  ###
  beforeDestroy : () ->
    slideObj = @
    self = slideObj.jqObj
    opts = slideObj.opts
    $(docuemnt).off ".#{opts.widgetKey}"
    return slideObj
###*
 * [initSlide description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initSlide = (self, opts) ->
  if opts.mode is 'vertical'
    opts.slideClass = opts.slideClassVerticalMode
    opts.sliderCrossClass = opts.sliderCrossClassVerticalMode
  slider = $ opts.sliderHTML
  sliderCross = $(opts.sliderCrossHTML).addClass opts.sliderCrossClass
  if opts.userImageSlider
    slider.addClass 'uiImageSlider uiIcon uiCicleIcon'
  else
    slider.addClass opts.sliderClass
  self.addClass("uiSlide uiWidget uiNoSelectText #{opts.slideClass}").append $(opts.panelHTML).append(sliderCross).append(slider)
  if opts.userImageSlider
    opts.sliderLength = slider.width()
  if opts.mode is 'vertical'
    opts.slideBegin = opts.sliderTop = self.offset().top
    slider.css 'left', opts.sliderLeft - 1
    sliderCross.width '100%'
    if not opts.userImageSlider
      slider.width(self.width() - 2 * opts.sliderLeft).height opts.sliderLength
    else
      slider.css 'top', -(opts.sliderLength >> 2)
  else
    opts.slideBegin = opts.sliderLeft = self.offset().left
    slider.css 'top', opts.sliderTop - 1
    sliderCross.height '100%'
    if not opts.userImageSlider
      slider.height(self.height() - 2 * opts.sliderTop).width opts.sliderLength
    else
      self.css 'left', -(opts.sliderLength >> 2)
    opts.slideLength = self.width()
  opts.slideMax = opts.slideLength
  if not opts.userImageSlider
    opts.slideMax -= (opts.sliderLength - 2)
  if not opts.noUserEvent
    initEvent self, opts
  if opts.slideValue isnt 0
    setSlide self, opts, opts.slideValue
  return null
###*
 * [initEvent description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initEvent = (self, opts) ->
  documentObj = $ document
  panelObj = $ '>.uiPanel', self
  panelObj.on 'click.uiSlide', (e) ->
    if $(e.target).hasClass 'uiSlider'
      return false
    if (opts.click self, $ @, e) is false
      return false
    if opts.mode is 'vertical'
      beginValue = e.clientY + documentObj.scrollTop() + self.parent().scrollTop()
    else
      beginValue = e.clientX + documentObj.scrollLeft() + self.parent().scrollLeft()
    percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax
    setSlide self, opts, Math.floor(percent * (opts.max - opts.min) + opts.min), opts.animation
  panelObj.on 'mousewheel.uiSlide', (e, delta) ->
    positionStr = 'left'
    if opts.mode is 'vertical'
      positionStr = 'top'
    percent = (parseInt $('>.uiSlider', @).css(positionStr)) / opts.slideMax
    setSlide self, opts,  Math.floor(percent * (opts.max - opts.min) + opts.min), false
    return false
  $('>.uiSlider', panelObj).on 'mousedown.uiSlide', (e) ->
    opts.slideDrag = true
  mouseMoveEvent = "mousemove.#{opts.widgetKey}"
  mouseUpEvent = "mouseup.#{opts.widgetKey}"
  documentObj.on {
    mouseMoveEvent : (e) ->
      if opts.slideDrag
        if opts.mode is 'vertical'
          beginValue = e.clientY + documentObj.scrollTop() + self.parent().scrollTop()
        else
          beginValue = e.clientX + documentObj.scrollLeft() + self.parent().scrollLeft()
        percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax
        setSlide self, opts, Math.floor(percent * (opts.max - opts.min) + opts.min), false
    mouseUpEvent : (e) ->
      opts.slideDrag = false
  }
  return null
###*
 * [setSlide description]
 * @param {[jQuery]} self      [description]
 * @param {[Object]} opts      [description]
 * @param {[Integer]} value     [description]
 * @param {[Boolean]} animate   [description]
 * @param {[Boolean]} jumpToEnd [description]
###
setSlide = (self, opts, value, animate, jumpToEnd) ->
  obj = $ '>.uiPanel >.uiSlider', self
  value ?= 0
  value = if value > opts.max then opts.max else (if value < 0 then 0 else value)
  opts.slideValue = value
  percent = (value - opts.min) / (opts.max - opts.min)
  value = opts.slideMax * percent
  if opts.userImageSlider && value is 0
    value = - (opts.sliderLength >> 2)
  sliderCross = $ '>.uiPanel >.uiSliderCross', self
  sliderCrossValue = value + 2
  if opts.mode is 'vertical'
    props = {top : value}
    sliderCrossProps = {height : sliderCrossValue}
  else
    props = {left : value}
    sliderCrossProps = {width : sliderCrossValue}
  if animate
    obj.stop(true, jumpToEnd).animate props, opts.animateTime, () ->
      opts.slide self, obj, opts.slideValue
    sliderCross.stop(true, jumpToEnd).animate sliderCrossProps, opts.animateTime
  else
    obj.css props
    sliderCross.css sliderCrossProps
    opts.slide self, obj, opts.slideValue
  return null