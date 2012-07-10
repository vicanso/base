$ = window.jQuery
$$ = window.BASE
###*
 * [progressBar description]
 * @param  {[Object]} {[Optional]} options [description]
 * @return {[jQuery, Others]}         [description]
###
$.fn.progressBar = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.ProgressBar
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.ProgressBar extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jquery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[ProgressBar]}         [description]
  ###
  constructor: (self, options) ->
    progressBarObj = @
    if not (progressBarObj instanceof $$.ProgressBar)
      return new $$.ProgressBar self, options

    defaults =
      progressBarClass : "#{$$.defaultGradientBG} #{$$.defaultBorder}"
      progressBlockClass : $$.hoverGradientBG
      blockWidth : 12
      marginValue : null
      type : "normal"
      scrollTime : 3000
      scrollValue : 0.19
      value : 0
      progressBarLength : 0
      scrolling : false
    
    opts = $.extend defaults, options
    progressBarObj.constructor.__super__.constructor.call progressBarObj, self, opts
    progressBarObj.init()
  ###*
   * [init description]
   * @return {[ProgressBar]} [description]
  ###
  init : () ->
    progressBarObj = @
    opts = progressBarObj.opts
    progressBarObj.createWidget()
    initProgressBar progressBarObj.jqObj, progressBarObj.opts
    progressBarObj.val opts.scrollValue
    if opts.type is 'scroll'
      progressBarObj.scroll true
    return progressBarObj
  ###*
   * [val description]
   * @param  {[Float]} {[Optional]} value [description]
   * @return {[ProgressBar, Float]}       [description]
  ###
  val : (value) ->
    progressBarObj = @
    self = progressBarObj.jqObj
    opts = progressBarObj.opts
    if arguments.length is 0
      return opts.value
    opts.value = if value > 1 then 1 else (if value < 0 then 0 else value)
    self.children('.progressValue').width opts.progressBarLength * opts.value
    return progressBarObj
  ###*
   * [scroll description]
   * @param  {[Boolean]} {[Optional]} scrolling [description]
   * @return {[ProgressBar]}           [description]
  ###
  scroll : (scrolling) ->
    progressBarObj = @
    self = progressBarObj.jqObj
    opts = progressBarObj.opts
    if opts.type isnt 'scroll' or (scrolling && opts.scrolling)
      return progressBarObj
    obj = self.children '.progressValue'
    if not scrolling
      opts.scrolling = false
      obj.stop()
    else
      marginLeftValue = opts.progressBarLength - (obj.width() + parseInt obj.css 'marginLeft' )
      opts.scrolling = true
      obj.animate {marginLeft : marginLeftValue}, opts.scrollTime, () ->
        opts.scrolling = false
        progressBarObj.scroll self, opts, true
    return progressBarObj
###*
 * [initProgressBar description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initProgressBar = (self, opts) ->
  progressValue = $ '<div class="progressValue"></div>'
  marginValue = opts.marginValue || 2
  blockTotal = Math.ceil self.width() / (opts.blockWidth + marginValue)
  for i in [1..blockTotal]
    obj = $('<div class="progressBlock"></div>').addClass(opts.progressBlockClass).width opts.blockWidth
    if opts.marginValue isnt null
      obj.css 'marginRight', opts.marginValue
    progressValue.append obj
  opts.progressBarLength = self.addClass("uiProgressBar uiWidget #{opts.progressBarClass}").append(progressValue).width()
  return null