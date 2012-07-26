$ = window.jQuery
$$ = window.BASE
###*
 * [list description]
 * @param  {[Object]} {[Optional]} options [description]
 * @return {[jQuery]}         [description]
###
$.fn.list = (options) ->
  self = @
  args = Array.prototype.slice.call arguments
  args.push $$.List
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.List extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[List]}         [description]
  ###
  constructor: (self, options) ->
    listObj = @
    if not (listObj instanceof $$.List)
      return new $$.List self, options
    defaults =
      title : null
      indexKey : "data-key"
      titleBarClass : $$.defaultGradientBG
      titleIcon : null
      listClass : "#{$$.defaultBorder} uiCornerAll #{$$.defaultBoxShadow}"
      listItemClass : "uiListItem"
      listItemHoverClass : "uiLightBlueGradientBG"
      listItemSelectedClass : "uiBlueGradientBG"
      click : $.noop
      listBackIndexArr : []
      showListItem : null
      listWidth : 0
      titleBarHTML : '<div class="uiListTitleBar uiNoSelectText"><span></span><span class="uiListBack uiIcon uiBackIcon">Back</span></div>'
      moreItemHTML : '<span class="uiListMoreBtn uiArrowRightIcon uiSmallIcon"></span>'
    
    opts = $.extend defaults, options
    listObj.constructor.__super__.constructor.call listObj, self, opts
    listObj.init()
  ###*
   * [init description]
   * @return {[List]} [description]
  ###
  init : () ->
    listObj = @
    listObj.createWidget()
    initList listObj.jqObj, listObj.opts
    return listObj
###*
 * [initList description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initList = (self, opts) ->
  title = opts.title || (self.attr 'title') || ''
  self.addClass("uiList uiWidget #{opts.listClass}").children('div:first').addClass 'uiListContent'
  if title
    titleBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).children('span:first').html(title).end()
    if opts.titleIcon
      titleBar.prepend $('<span class="uiTitleIcon" />').addClass opts.titleIcon
    self.prepend titleBar
  self.find('li').each () ->
    obj = $ @
    obj.addClass opts.listItemClass
    if obj.attr opts.indexKey
      obj.addClass('uiListMore').prepend opts.moreItemHTML
  ulHeight = self.height() - $('>.uiListTitleBar', self).outerHeight true
  opts.listWidth = $('>.uiListContent > ul', self).filter(':gt(0)').hide().end().height(ulHeight).width()
  initEvent self, opts
  return null
###*
 * [initEvent description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initEvent = (self, opts) ->
  $('>.uiListTitleBar >.uiListBack', self).on 'click.uiList', (e) ->
    number = opts.listBackIndexArr.pop()
    if opts.listBackIndexArr.length is 0
      $(@).fadeOut opts.defaultAnimateDuration
    obj = $('>.uiListContent > ul', self).filter "[#{opts.indexKey}=\"#{number}\"]"
    if obj.length is 0
      return 
    marginLeftValue = obj.css 'marginLeft'
    obj.css('marginLeft', -opts.listWidth).show().animate {marginLeft : 0}, opts.defaultAnimateDuration, () ->
      if opts.showListItem?
        opts.showListItem.show()
      $(@).css 'marginLeft', marginLeftValue
  $('>.uiListContent > ul', self).on 'click.uiList mouseover.uiList mouseout.uiList', (e) ->
    target = $ e.target
    jQueryProp = if self.prop then 'prop' else 'attr'
    if target[jQueryProp]('tagName').toUpperCase() isnt 'LI'
      target = target.parent()
    if event.type is 'click'
      if target.hasClass 'uiListMore'
        number = target.attr opts.indexKey
        currentObj = $ @
        currentNumber = currentObj.attr opts.indexKey
        obj = currentObj.siblings("[#{opts.indexKey}=\"#{number}\"]").show()
        if obj.length is 0
          return
        $('>.uiListTitleBar >.uiListBack', self).fadeIn opts.defaultAnimateDuration
        opts.listBackIndexArr.push currentNumber
        marginLeftValue = currentObj.css 'marginLeft'
        currentObj.animate {marginLeft : -opts.listWidth}, opts.defaultAnimateDuration, () ->
          opts.showListItem = obj
          $(@).hide().css 'marginLeft', marginLeftValue
      else
        target.removeClass(opts.listItemHoverClass).addClass opts.listItemSelectedClass
        target.siblings(".#{opts.listItemSelectedClass}").toggleClass "#{opts.listItemClass} #{opts.listItemSelectedClass}"
        opts.click self, target, e
    else if event.type is 'mouseover'
      if target.hasClass opts.listItemClass
        target.removeClass(opts.listItemClass).addClass opts.listItemHoverClass
    else if event.type is 'mouseout'
      if target.hasClass opts.listItemHoverClass
        target.removeClass(opts.listItemHoverClass).addClass opts.listItemClass
  return null

