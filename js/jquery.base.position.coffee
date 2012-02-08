$ = window.jQuery
$$ = window.BASE
$.fn.moveToPos = (options) ->
  self = @
  positionObj = new $$.Position self
  positionObj.moveToPos options
  return self
class $$.Position
  constructor : (self, options) ->
    positionObj = @
    if not (positionObj instanceof $$.Position)
      return new $$.Position self, options
    positionObj.opts = {};
    $.extend positionObj.opts, $$.Position.prototype.defaults, options
    positionObj.jqObj = self;
  defaults : {
    returnOldPos : false
    oldPos : null
  }
  moveToPos : (position) ->
    positionObj = @
    self = positionObj.jqObj
    opts = positionObj.opts
    oldPos = {
      position : null
      left : null
      top : null
      right : null
      bottom : null
    }
    self.css 'margin', 0
    if opts.returnOldPos
      $.each oldPos, (key) ->
        oldPos[key] = self.css key
      returnValue = oldPos
    else
      returnValue = positionObj
    if position is undefined
      position = opts.position
    if typeof position is 'string'
      setPosByStr self, position
    else if $.isPlainObject position
      setPosByObject self, position
    return returnValue
setPosByStr = (self, posStr) ->
  windowObj = $ window
  parentObj = self.parent()
  propFunc = if $.prop then 'prop' else 'attr'
  if (parentObj[propFunc] 'tagName').toUpperCase() is 'BODY'
    parentObj = windowObj
  windowWidth = windowObj.width()
  windowHeight = windowObj.height()
  parentWidth = parentObj.width()
  parentHeight = parentObj.height()
  targetWidth = self.outerWidth()
  targetHeight = self.outerHeight()
  posSetting = {
    position : 'absolute'
    left : null
    top : null
    right : null
    bottom : null
  }
  parentOffset = self.parent().offset()
  if (self.css 'position') is 'fixed'
    posSetting.position = 'fixed'
  switch posStr.toLowerCase()
    when 'center'
      parentWidth = Math.max (Math.min parentWidth, windowWidth), targetWidth
      parentHeight = Math.max (Math.min parentHeight, windowHeight), targetHeight
      posSetting['left'] =  parentOffset.left + (parentWidth - targetWidth) / 2
      posSetting["top"] = parentOffset.top + (parentHeight - targetHeight) / 2 + ($ document).scrollTop()
    when 'leftbottom'
      posSetting["left"] = posSetting["bottom"] = 0
    when 'lefttop'
      posSetting["left"] = posSetting["top"] = 0
    when 'righttop'
      posSetting["right"] = posSetting["top"] = 0
    when 'rightbottom'
      posSetting["right"] = posSetting["bottom"] = 0
    else
      posSetting[posStr] = 0
  self.css posSetting
  return null
setPosByObject = (self, pos) ->
  posSetting = {
    position : 'absolute'
    left : null
    top : null
    right : null
    bottom : null
  }
  $.extend posSetting, pos
  if self.css 'position' is 'fixed'
    posSetting.position = "fixed"
  self.css posSetting
  return null

