$ = window.jQuery
$$ = window.BASE

$.fn.dialog = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.Dialog
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result
class $$.Dialog extends $$.Widget
  constructor: (self, options) ->
    dialogObj = @
    if not (dialogObj instanceof $$.Dialog)
      return new $$.Dialog self, options

    defaults = 
      dialogClass : "#{$$.defaultBorder} uiCornerAll #{$$.defaultBoxShadow}"
      titleBarClass : $$.defaultGradientBG
      position : null
      zIndex : 1000
      draggable : false
      resizable : false
      minStatusWidth : 250
      modal : false
      buttonSet : null
      minHeight : 300
      maxHeight : 700
      minWidth : 400
      maxWidth : 1000
      active : true
      minimize : false
      closable : true
      noTitleBar : false
      titleIcon : ''
      title : ''
      controlButton : true
      autoOpen : true
      destroyOnClose : true
      closeAnimate : 'slideUp'
      openAnimate : 'slideDown'

      beforeClose : $.noop
      close : $.noop
      beforeOpen : $.noop
      open : $.noop
      beforeMin : $.noop
      min : $.noop
      beforeResume : $.noop
      resume : $.noop
      dragStart : $.noop
      draging : $.noop
      dragStop : $.noop
      resizeStart : $.noop
      resizing : $.noop
      resizeStop : $.noop

      minStatusHeight : 0
      originHeight : 0
      originWidth : 0
      originPosition : null
      overflowStatus : null
      controlButtonSetHTML : '<div class="uiDialogButtonSet"><div class="uiUserBtn uiMinBtn uiIcon uiMinButtonIcon"></div><div class="uiUserBtn uiCloseBtn uiIcon uiCloseButtonIcon"></div></div>'
      titleBarHTML : '<div class="uiTitleBar"><div class="uiTitle"></div></div>'
      contentHTML : '<div class="uiContent"></div>'
      resizeHTML :'<div class="uiResizable"></div>'
      selectList : null
    
    opts = $.extend defaults, options
    dialogObj.constructor.__super__.constructor.call dialogObj, self, opts
    dialogObj.init()
  init : () ->
    dialogObj = @
    dialogObj.createWidget()
    initDialog dialogObj, dialogObj.jqObj, dialogObj.opts
    return dialogObj
  title : (title) ->
    dialogObj = @
    self = dialogObj.jqObj
    opts = dialogObj.opts
    obj = $ '>.uiTitleBar >.uiTitle', self
    if arguments.length is 0
      return obj.text()
    opts.title = title
    obj.html obj.html().replace(obj.text(), title)
  titleIcon : (titleIcon) ->
    dialogObj = @
    self = dialogObj.jqObj
    opts = dialogObj.opts
    if arguments.length is 0
      return opts.titleIcon
    if opts.titleIcon isnt ''
      $('>.uiTitleBar >.uiTitle', self).prepend '<span class="uiTitleIcon" />'
    obj = $('>.uiTitleBar >.uiTitle >.uiTitleIcon', self).removeClass(opts.titleIcon).addClass titleIcon
    opts.titleIcon = titleIcon
    return dialogObj
  content : (content) ->
    dialogObj = @
    self = dialogObj.jqObj
    opts = dialogObj.opts
    contentObj = self.children '.uiContent'
    if arguments.length is 0
      return contentObj
    contentObj.empty().append $ content
    return dialogObj
initDialog = (dialogObj, self, opts) ->
  titleBarClass = "#{opts.titleBarClass} uiCornerAll"
  if opts.title is ''
    opts.title = (self.attr 'title') or ''
  if opts.draggable
    titleBarClass += ' uiDraggable'
  if opts.controlButton
    controlButton = $ opts.controlButtonSetHTML
    if not opts.minimize
      controlButton.children('.uiMinBtn').hide()
    if not opts.closable
      controlButton.children('.uiCloseBtn').hide()
  contentObj = self.children().addClass 'uiContent'
  if not opts.noTitleBar
    titleBar = $(opts.titleBarHTML).addClass(titleBarClass).append(controlButton).children('.uiTitle').html(opts.title).end()
    if opts.titleIcon isnt ''
      titleBar.children('.uiTitle').prepend($('<span class="uiTitleIcon" />')).addClass opts.titleIcon
    self.prepend titleBar
  self.addClass "uiDialog uiWidget #{opts.dialogClass}"
  if opts.position isnt null
    self.css('zIndex', opts.zIndex + 1).moveToPos opts.position
  if opts.modal
    maskObj = $('<div />').addClass('uiMask').appendTo 'body'
    if opts.position is null
      self.css('zIndex', opts.zIndex + 1).moveToPos {position : 'center'}
    if $$.msie6
      opts.selectList = $('select:visible').filter () ->
        if $(@).css 'visibility' isnt 'hidden'
          return true
      opts.selectList.css 'visibility', 'hidden'
      maskObj.height $(document).height()
  if opts.buttonSet isnt null
    buttonSetHTML = '<div>'
    for key, value of opts.buttonSet
      buttonSetHTML += ('<div>' + key + '</div>');
    buttonSetHTML += '</div>'
    buttonSetObj = $(buttonSetHTML).buttonSet {click : (target) ->
      if (opts.buttonSet[target.text()] @) is false
        return false
      dialogObj.close self, opts, target
    }
    buttonSetObj.appendTo self
  if opts.resizable
    self.append opts.resizeHTML
    if self.css('position') is 'static'
      self.css 'position', 'relative'
  opts.minHeight = Math.min self.height(), opts.minHeight
  opts.minWidth = Math.min self.width(), opts.minWidth
  setContentHeight self, opts
  initEvent dialogObj, self, opts
  if not opts.autoOpen
    self.hide()
initEvent = (dialogObj, self, opts) ->
  posStr = self.css 'position'
  self.find('>.uiTitleBar >.uiDialogButtonSet >.uiUserBtn').on 'click.uiDialog', (e) ->
    obj = $ @
    if obj.hasClass 'uiMinBtn'
      func = 'min'
    else if obj.hasClass 'uiResumeBtn'
      func = 'resume'
    else if obj.hasClass 'uiCloseBtn'
      func = 'close'
    if func?
      if self.is ':animated'
        return false
      dialogObj[func] self, opts, obj, e
      return false
  if opts.draggable
    dragStopFunction = (dragObj, mask, offset) ->
      if (opts.dragStop self ) is false
        return false
      self.offset offset
    self.draggable {event : {start : opts.dragStart, doing : opts.draging,  stop : dragStopFunction}}
  if opts.resizable
    resizeStopFunc = (resizeObj, mask, width, height) ->
      if (opts.resizeStop self) is false
        return false
      height = Math.min (Math.max opts.minHeight, height), opts.maxHeight
      width = Math.min (Math.max opts.minWidth, width), opts.maxWidth
      otherItemHeightTotal = 0
      content = self.width(width).height(height).children '.uiContent'
      self.children().each () ->
        obj = $ @
        if not obj.hasClass 'uiContent' and (not obj.hasClass 'uiResizable')
          otherItemHeightTotal += obj.outerHeight true
      outerOffset = content.outerHeight true - content.height()
      content.height height - otherItemHeightTotal - outerOffset
    self.resizable {
      event : 
        start : opts.resizeStart
        doing : opts.resizing
        stop : resizeStopFunc
      minHeight : opts.minHeight
      maxHeight : opts.maxHeight
      minWidth : opts.minWidth
      maxWidth : opts.maxWidth
    }
setContentHeight = (self, opts) ->
  otherItemHeightTotal = 0
  content = self.children '.uiContent'
  self.children().each () ->
    obj = $ @
    if not obj.hasClass 'uiContent' and not (obj.hasClass 'uiResizable')
      otherItemHeightTotal += $(@).outerHeight true
  contentHeight = content.outerHeight true
  outerOffset = contentHeight - content.height()
  imgList = self.find 'img'
  imgTotal = imgList.length
  if imgTotal is 0
    completeLoad = 0
    imgList.each () ->
      if this.complete
        completeLoad++
        if completeLoad is imgTotal
          content.height self.height() - otherItemHeightTotal - outerOffset
      else
        $(@).load () ->
          completeLoad++
          if completeLoad is imgTotal
            content.height self.height() - otherItemHeightTotal - outerOffset
  content.height self.height() - otherItemHeightTotal - outerOffset
  return null
