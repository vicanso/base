$ = window.jQuery
$$ = window.BASE

class Interaction
  constructor : (self, options) ->
    interactionObj = @
    interactionObj.jqObj = self
    opts = interactionObj.opts = {}
    $.extend opts, Interaction.prototype.defaults, options
    opts.widgetKey = $$.getRandomKey()
    return interactionObj
  defaults : {
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
    event : {
      start : $.noop
      doing : $.noop
      stop : $.noop
    }
    maskHTML : '<div class="uiInteractionMask uiInactive uiCornerAll uiBlackBigBorder"></div>'
  }
  init : () ->
    interactionObj = @
    self = interactionObj.jqObj
    opts = interactionObj.opts
    jQueryEvent =  if self.off then 'on' else 'bind'
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
    obj[jQueryEvent] mouseDownEvent, (e) ->
      setInteractionSetting self, opts, e
      if opts.type is 'resize'
        return false
      return !opts.stopMouseDownPropagation
    mouseMoveEvent = "mousemove.#{opts.widgetKey}"
    mouseUpEvent = "mouseup.#{opts.widgetKey}"
    ($ document)[jQueryEvent] mouseMoveEvent, (e) ->
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
          (maskItem.width newWidth).height newHeight
        else if opts.type is 'drag'
          position = {
            left : opts.originPosition.left + offsetX
            top : opts.originPosition.top + offsetY
          }
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
    ($ document)[jQueryEvent] mouseUpEvent, () ->
      complete self, opts
    return interactionObj
complete = (self, opts) ->
  if opts.doing is false
    opts.start = false
    return
  maskItem = opts.mask
  opts.start = opts.doing = false
  if opts.type is 'resize'
    if (opts.event.stop self, maskItem, maskItem.width(), maskItem.height()) is false
      return
  else if opts.type is 'drag'
    offset = maskItem.offset()
    if (opts.event.stop self, maskItem, offset) is false
      return
  maskItem.remove()
  opts.mask = null
setInteractionSetting = (self, opts, e) ->
  opts.start = true
  if (opts.event.start self) is false or (($ e.target).hasClass 'uiUserBtn')
    opts.start = false
    return false
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
    opts.mask = (self.clone().css {
      position : 'absolute'
      left : maskPosition.left
      top : maskPosition.top

    }).appendTo 'body'
  else
    marginLeftValue = self.css 'marginLeft'
    marginTopValue = self.css 'marginTop'
    opts.mask = ((((($ opts.maskHTML).width maskWidth).height maskHeight).css {
      marginLeft : marginLeftValue
      marginTop : marginTopValue
      left : maskPosition.left
      top : maskPosition.top
    }).hide().addClass 'uiBlackBigBorder uiCornerAll').appendTo 'body'
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



