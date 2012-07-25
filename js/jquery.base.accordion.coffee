$ = window.jQuery
$$ = window.BASE
###*
 * [accordion description]
 * @param  {[Object]} {[Optional]} options [description]
 * @return {[jQuery, Others]}         [description]
###
$.fn.accordion = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.Accordion
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result
class $$.Accordion extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[Accordion]}         [description]
  ###
  constructor: (self, options) ->
    accordionObj = @
    if not (accordionObj instanceof $$.Accordion)
      return new $$.Accordion self, options
    defaults = 
      accordionClass : "#{$$.defaultBorder} uiCornerAll #{$$.defaultBoxShadow}"
      titleBarClass : $$.defaultGradientBG
      activeClass : $$.defaultGradientBG
      itemTitleBarClass : 'uiBlueGradientBG'
      active : [0]
      event : 'click'
      titleIcon : null
      animation : 'toggle'
      title : null
      itemTitleList : null
      height : "auto"
      toggle : false
      hideOthers : true
      animating : false
      titleBarHTML : '<div class="uiAccordionTitleBar uiNoSelectText"><span class="title"></span></div>'
      itemTitleBarHTML : '<div class="uiTitleBar uiNoSelectText"><span class="uiUserBtn uiSmallIcon uiArrowDownIcon"></span><span class="uiTitle"></span></div>'

      changeStart : $.noop
      change : $.noop
      
    opts = $.extend defaults, options
    accordionObj.constructor.__super__.constructor.call accordionObj, self, opts
    accordionObj.init()
  ###*
   * [init description]
   * @return {[Accordion]} [description]
  ###
  init : () ->
    accordionObj = @
    accordionObj.createWidget()
    initAccordion accordionObj.jqObj, accordionObj.opts
    return accordionObj
  ###*
   * [activate description]
   * @param  {[Integer]} {[Optional]} index [description]
   * @return {[Array, Accordion]}       [description]
  ###
  activate : (index) ->
    accordionObj = @
    self = accordionObj.jqObj
    opts = accordionObj.opts
    if arguments.length is 0
      activateArr = []
      titleBarList = $ '> .uiTitleBar', self
      titleBarList.each (n) ->
        if $(@).hasClass opts.activeClass
          activateArr.push n
      return activateArr
    obj = $('> .uiTitleBar', self).eq index
    if not obj.hasClass opts.activeClass
      obj.trigger opts.event
    return accordionObj
  ###*
   * [item description]
   * @param  {[Integer]} {[Optional]} index   [description]
   * @param  {[String]} {[Optional]} content [description]
   * @param  {[String]} {[Optional]} title   [description]
   * @return {[jQuery, Accordion]}         [description]
  ###
  item : (index, content, title) ->
    accordionObj = @
    self = accordionObj.jqObj
    opts = accordionObj.opts
    index ?= 0
    titleBarObj = $('> .uiTitleBar', self).eq index
    contentObj = titleBarObj.next()
    if arguments.length is 1
      return contentObj
    if arguments.length is 2
      if content?
        contentObj.html content
        return accordionObj
      return titleBarObj
    titleBarObj.children('.uiTitle').html title
    if content?
      contentObj.html content
    return accordionObj
  ###*
   * [addItem description]
   * @param {[HTML, DOM, jQuery]} item  [description]
   * @param {[String]} {[Optional]} title [description]
   * @param {[Integer]} {[Optional]} index [description]
   * @return {[Accordion]} [description]
  ###
  addItem : (item, title, index) ->
    accordionObj = @
    self = accordionObj.jqObj
    opts = accordionObj.opts
    itemObj = $ item
    title ?= itemObj.attr 'title'
    titleBarObj = $(opts.itemTitleBarHTML).addClass(opts.itemTitleBarClass).children('.uiTitle').html(title).end()
    itemObj.addClass('uiContent uiHidden').height opts.height
    if arguments.length is 2
      obj = $('> .uiTitleBar', self).eq index
      titleBarObj.insertBefore obj
      itemObj.insertBefore obj
    else
      self.append(titleBarObj).append itemObj
    return accordionObj
  ###*
   * [removeItem description]
   * @param  {[Integer]} {[Optional]} index [description]
   * @return {[jQuery]}       [description]
  ###
  removeItem : (index) ->
    accordionObj = @
    self = accordionObj.jqObj
    opts = accordionObj.opts
    index ?= 0
    return $('>.uiTitleBar', self).eq(index).next().andSelf().remove()
  ###*
   * [title description]
   * @param  {[String]} {[Optional]} title [description]
   * @return {[String, Accordion]}       [description]
  ###
  title : (title) ->
    accordionObj = @
    self = accordionObj.jqObj
    opts = accordionObj.opts
    obj = $ '>.uiAccordionTitleBar > .title', self
    if arguments.length is 0
      return obj.text()
    obj.text title
    return accordionObj
  ###*
   * [titleIcon description]
   * @param  {[String]} {[Optional]} titleIcon [description]
   * @return {[String, Accordion]}           [description]
  ###
  titleIcon : (titleIcon) ->
    accordionObj = @
    self = accordionObj.jqObj
    opts = accordionObj.opts
    if arguments.length is 0
      return opts.titleIcon
    if opts.titleIcon is null
      $('>.uiAccordionTitleBar', self).prepend $('<span class="uiTitleIcon" />')
    obj = $('> .uiAccordionTitleBar > span.uiTitleIcon', self).removeClass(opts.titleIcon).addClass titleIcon
    opts.titleIcon = titleIcon
    return accordionObj
###*
 * [initAccordion description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initAccordion = (self, opts) ->
  title = opts.title || self.attr 'title'
  if title?
    titleBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).children('.title').html(title).end()
    if opts.titleIcon?
      titleBar.prepend($ '<span class="uiTitleIcon" />').addClass opts.titleIcon
  self.addClass("uiAccordion uiWidget #{opts.accordionClass}").children('div').each (n) ->
    contentClass = 'uiHidden'
    titleBarClass = opts.itemTitleBarClass
    buttonClass = ''
    obj = $ @
    if opts.active is 'all' or ($.inArray n, opts.active) isnt -1
      contentClass = ''
      titleBarClass =  "#{opts.activeClass} uiActive"
      buttonClass = 'uiArrowUpIcon uiArrowDownIcon'
    title = null
    if $.isArray opts.itemTitleList
      title = opts.itemTitleList[n]
    title ?= obj.attr 'title'
    itemTitleBarObj = $(opts.itemTitleBarHTML).addClass titleBarClass
    itemTitleBarObj.children('.uiUserBtn').toggleClass(buttonClass).siblings('.uiTitle').html title
    itemTitleBarObj.insertBefore obj.addClass("uiContent #{contentClass}").height(opts.height)
  self.prepend titleBar
  initEvent self, opts
  return null
###*
 * [initEvent description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initEvent = (self, opts) ->
  self.on "#{opts.event}.uiAccordion", (e) ->
    if opts.disabled or opts.animating
      return
    target = $ e.target
    if not target.hasClass 'uiTitleBar'
      target = target.parent '.uiTitleBar'
      if target.length is 0
        return
    if not opts.toggle
      if target.hasClass opts.activeClass
        return
    if (opts.changeStart self, target, e) is false
      return false
    opts.animating = true
    selectedList = if (opts.hideOthers is true) then $(">.uiTitleBar.#{opts.activeClass}", self).not(target).removeClass("#{opts.activeClass} uiActive").addClass(opts.itemTitleBarClass) else null
    changeObjList = target.toggleClass("#{opts.itemTitleBarClass} #{opts.activeClass} uiActive").add selectedList
    changeObjList.children('.uiUserBtn').toggleClass 'uiArrowUpIcon uiArrowDownIcon'
    changeObjList.next('.uiContent').stop(true, true)[opts.animation] opts.animateTime, () ->
      if $(@).is ':visible'
        opts.change self, target, e
      opts.animating = false
  return null
###*
 * [setContentHeight description]
 * @param {[jQuery]} self [description]
 * @param {[Object]} opts [description]
###
setContentHeight = (self, opts) ->
  otherItemHeightTotal = 0
  content = self.children '.uiContent'
  self.children().each () ->
    obj = $ @
    if not obj.hasClass 'uiContent' && not obj.hasClass 'uiResizable'
      otherItemHeightTotal += ($ @).outerHeight true
  contentHeight = content.outerheight true
  outerOffset = contentHeight - content.height()
  imgList = self.find 'img'
  if imgList.length isnt 0
    imgTotal = imgList.length
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
  else
    content.height self.height() - otherItemHeightTotal - outerOffset
  return null
