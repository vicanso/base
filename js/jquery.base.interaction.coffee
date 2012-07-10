$ = window.jQuery
$$ = window.BASE

class Interaction
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} options [description]
   * @return {[Interaction]}         [description]
  ###
  constructor : (self, options) ->
    interactionObj = @
    interactionObj.jqObj = self
    interactionObj.opts = {}

    defaults =
      disable : false
      getUserMask : null
      originMask : false
      stopMouseDownPropagation : false
      start : false
      originClientX : 0
      originClientY : 0
      doing : false
      type : null
      mask : null
      event : 
        start : $.noop
        doing : $.noop
        stop : $.noop
      maskHTML : '<div class="uiInteractionMask uiInactive uiCornerAll uiBlackBigBorder"></div>'
    
    $.extend interactionObj.opts, defaults, options
    interactionObj.opts.widgetKey = $$.getRandomKey()
  ###*
   * [init description]
   * @return {[Interaction]} [description]
  ###
  init : () ->
    interactionObj = @
    self = interactionObj.jqObj
    opts = interactionObj.opts

    if opts.type is 'resize'
      obj = self.find '.uiResizable'
      if obj.length is 0
        if self.css 'position' is 'static'
          self.css 'position', 'relative'
        obj = ($ '<div class="uiResizable"></div>').appendTo self
    else if opts.type is 'drag'
      obj = self.find '.uiDraggable'
      if obj.length is 0
        obj = self.addClass 'uiDraggable'
    mouseDownEvent = "mousedown.#{opts.type}"
    obj.on mouseDownEvent, (e) ->
      setInteractionSetting self, opts, e
      if opts.type is 'resize'
        return false
      return !opts.stopMouseDownPropagation
    mouseMoveEvent = "mousemove.#{opts.widgetKey}"
    mouseUpEvent = "mouseup.#{opts.widgetKey}"

    $(document).on mouseMoveEvent, (e) ->
      if opts.start
        if opts.mask is null
          if (setInteractionMask self, opts, e) is false
            return
        maskItem = opts.mask
        opts.doing = true
        offsetX = e.clientX - opts.originClientX
        offsetY = e.clientY - opts.originClientY
        if opts.type is 'resize'
          newWidth = opts.originWidth + offsetX
          newHeight = opts.originHeight + offsetY
          if opts.maxWidth isnt null
            if newWidth > opts.maxWidth
              newWidth = opts.maxWidth
          if opts.minWidth isnt null
            if newWidth < opts.minWidth
              newWidth = opts.minWidth
          if opts.maxHeight isnt null
            if newHeight > opts.maxHeight
              newHeight = opts.maxHeight
          if opts.minHeight isnt null
            if newHeight < opts.minHeight
              newHeight = opts.minHeight
          if (opts.event.doing self, maskItem, newWidth, newHeight) is false
            return
          maskItem.width(newWidth).height newHeight
        else if opts.type is 'drag'
          position = 
            left : opts.originPosition.left + offsetX
            top : opts.originPosition.top + offsetY
          if (opts.event.doing self, maskItem, position) is false
            return
          maskItem.css position
          if opts.dest isnt null
            if (checkArea opts, position, opts.destPosition) is true
              if not opts.firstCross
                opts.cross self, true
                opts.firstCross = true
            else
              if opts.firstCross
                opts.cross self, false
                opts.firstCross = false
        return false
    $(document).on mouseUpEvent, () ->
      complete self, opts
    return interactionObj
###*
 * [complete description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
complete = (self, opts) ->
  if opts.doing is false
    opts.start = false
    return null
  maskItem = opts.mask
  opts.start = opts.doing = false
  if opts.type is 'resize'
    if (opts.event.stop self, maskItem, maskItem.width(), maskItem.height()) is false
      return null
  else if opts.type is 'drag'
    offset = maskItem.offset()
    if (opts.event.stop self, maskItem, offset) is false
      return null
  maskItem.remove()
  opts.mask = null
  return null
###*
 * [setInteractionSetting description]
 * @param {[jQuery]} self [description]
 * @param {[Object]} opts [description]
 * @param {[Event]} e    [description]
###
setInteractionSetting = (self, opts, e) ->
  opts.start = true
  if (opts.event.start self) is false or $(e.target).hasClass('uiUserBtn')
    opts.start = false
    return false
  return null
###*
 * [setInteractionMask description]
 * @param {[jQuery]} self [description]
 * @param {[Object]} opts [description]
 * @param {[Event]} e    [description]
 * @return {[Boolean]}  [description]
###
setInteractionMask = (self, opts, e) ->
  maskHeight = self.outerHeight()
  maskWidth = self.outerWidth()
  maskPosition = self.offset()
  opts.originClientX = e.clientX
  opts.originClientY = e.clientY
  opts.outerHeight = maskHeight
  opts.outerWidth = maskWidth
  opts.originWidth = self.width()
  opts.originHeight = self.height()
  opts.originPosition = opts.position = maskPosition
  if $.isFunction opts.getUserMask
    opts.mask = opts.getUserMask self
    if opts.mask.length is 0
      opts.mask = null
      opts.start = false
      return false
    else
      opts.position = opts.originPosition = opts.mask.offset()
  else if opts.originMask
    opts.mask = self.clone().css({
      position : 'absolute'
      left : maskPosition.left
      top : maskPosition.top

    }).appendTo 'body'
  else
    marginLeftValue = self.css 'marginLeft'
    marginTopValue = self.css 'marginTop'
    opts.mask = $(opts.maskHTML).width(maskWidth).height(maskHeight).css({
      marginLeft : marginLeftValue
      marginTop : marginTopValue
      left : maskPosition.left
      top : maskPosition.top
    }).hide().addClass('uiBlackBigBorder uiCornerAll').appendTo 'body'
  opts.mask.show()
  if opts.type is 'drag' and opts.dest isnt null
    dest = $ opts.dest
    opts.destPosition = []
    dest.each ()->
      obj = $ @
      pos = obj.offset()
      destWidth = obj.width()
      destHeight = obj.height()
      opts.destPosition.push {
        leftTop : [pos.left, pos.top],
        rightBottom : [pos.left + destWidth, pos.top + destHeight]
      }
  return true
###*
 * [checkArea description]
 * @param  {[Object]} opts            [description]
 * @param  {[Object]} position        [description]
 * @param  {[Array]} destPositionArr [description]
 * @return {[Boolean]}                 [description]
###
checkArea = (opts, position, destPositionArr) ->
  left = position.left
  top = position.top
  right = left + opts.outerWidth
  bottom = top + opts.outerHeight
  crossFlag = false
  check = (pos) ->
    if not (left > pos.rightBottom[0] or right < pos.leftTop[0] or bottom < pos.leftTop[0] or top > pos.rightBottom[1])
      return true
    else
      return false
  for pos in destPositionArr
    if (check pos) is true
      crossFlag = true
      break
  return crossFlag
###*
 * [draggable description]
 * @param  {[Object]} {[Optional]} options [description]
 * @return {[jQuery]}         [description]
###
$.fn.draggable = (options) ->
  self = @
  draggableObj = new $$.Draggable self, options
  draggableObj.init self, draggableObj.opts
  return self
class $$.Draggable extends Interaction
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[Draggable]}         [description]
  ###
  constructor: (self, options) ->
    draggableObj = @
    if not (draggableObj instanceof $$.Draggable)
      return new $$.Draggable self, options

    defaults =
      dest : null
      originPosition : null
      position : null
      outerWidth : null
      outerHeight : null
      destPosition : null
      firstCross : false
      type : "drag"
      widgetKey : null
      cross : null
    opts = $.extend {}, defaults, options
    draggableObj.constructor.__super__.constructor.call draggableObj, self, opts
    opts = draggableObj.opts
    if opts.event.stop is $.noop
      opts.event.stop = (mask, offset) ->
        self.moveToPos {position : offset}
        return null
###*
 * [resizable description]
 * @param  {[Object]} options [description]
 * @return {[jQuery]}         [description]
###
$.fn.resizable = (options) ->
  self = @
  resizableObj = new $$.Resizable self, options
  resizableObj.init self, resizableObj.opts
  return self

class $$.Resizable extends Interaction
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[Resizable]}         [description]
  ###
  constructor: (self, options) ->
    resizableObj = @
    if not (resizableObj instanceof $$.Resizable)
      return new $$.Resizable self, options
    defaults =
      minWidth : null,
      minHeight : null,
      maxWidth : 0xffff,
      maxHeight : 0xffff,
      originWidth : 0,
      originHeight : 0,
      type : "resize",
      outerWidth : null,
      outerHeight : null,
      destPosition : null
    opts = $.extend {}, defaults, options
    resizableObj.constructor.__super__.constructor.call resizableObj, self, opts
    opts = resizableObj.opts
    if opts.event.stop is $.noop
      opts.event.stop = (resizeObj, mask, width, height) ->
        if(opts.resizeStop self) is false
          return false
        height = Math.min (Math.max opts.minHeight, height), opts.maxHeight
        width = Math.min (Math.max opts.minWidth, width), opts.maxWidth
        otherItemHeightTotal = 0
        content = ((self.width width).height height).children '.uiContent'
        self.children().each () ->
          obj = $ @
          if not obj.hasClass 'uiContent' and not (obj.hasClass 'uiResizable')
            otherItemHeightTotal += ($ @).outerHeight true
        outerOffset = (content.outerHeight true) - content.height()
        content.height height - otherItemHeightTotal - outerOffset
        return null

