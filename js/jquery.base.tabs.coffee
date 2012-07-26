$ = window.jQuery
$$ = window.BASE
###*
 * [tabs description]
 * @param  {[Object]} options [description]
 * @return {[jQuery]}         [description]
###
$.fn.tabs = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.Tabs
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.Tabs extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[Tabs]}         [description]
  ###
  constructor: (self, options) ->
    tabsObj = @
    if not (tabsObj instanceof $$.Tabs)
      return new $$.Tabs self, options
    defaults =
      tabsClass : "#{$$.defaultBorder} uiCornerAll #{$$.defaultBoxShadow}"
      titleBarClass : $$.defaultGradientBG
      tabsItemWidth : -1
      tabsItemMargin : -1
      closableArray : "all"
      activateIndex : 0
      tabsItemHoverClass : $$.hoverGradientBG
      tabsItemSelectedClass : "selected"
      titleList : null
      change : $.noop
      close : $.noop
      leftClick : $.noop
      rightClick : $.noop
      tabsItemTotal : 0
      tabsItemOuterWidth : 0
      tabsItemViewTotal : 0
      tabsItemViewIndex : 0
      titleBarHTML : '<div class="uiTitleBar uiTabsList uiNoSelectText"><div class="uiListContent"><div class="uiTabsItemContainer"></div></div></div>'
      tabsItemHTML : '<div class="uiTabsItem uiCornerTop"></div>'
      contentHTML : '<div class="uiContent"></div>'
      controlHTML : '<div class="uiLeftArrow uiSmallIcon uiArrowLeftIcon"></div><div class="uiRightArrow uiSmallIcon uiArrowRightIcon""></div>'
      closeHTML : '<div class="uiCloseItemBtn uiSmallIcon uiSmallcloseButtonIcon"></div>'
    
    opts = $.extend defaults, options
    tabsObj.constructor.__super__.constructor.call tabsObj, self, opts
    tabsObj.init()
  ###*
   * [init description]
   * @return {[Tabs]} [description]
  ###
  init : () ->
    tabsObj = @
    tabsObj.createWidget()
    initTabs tabsObj.jqObj, tabsObj.opts
    return tabsObj
  ###*
   * [addItem description]
   * @param {[String, DOM, jQuery]} content [description]
   * @param {[String]} {[Optional]} title   [description]
   * @param {[Integer]} {[Optional]} index   [description]
   * @return {[Tabs]} [description]
  ###
  addItem : (content, title, index) ->
    tabsObj = @
    self = tabsObj.jqObj
    opts = tabsObj.opts
    contentObj = $ content
    title ?= contentObj.attr 'title'
    if isNaN parseInt(index)
      itemTarget = $ '> .uiTabsList > .uiListContent > .uiTabsItemContainer', self
      contentTarget = self
      insertFunc = 'appendTo'
    else
      itemTarget = ($ '> .uiTabsList > .uiListContent > .uiTabsItemContainer > .uiTabsItem', self).eq index
      contentTarget = (self.childdren '.uiTabsContent').eq index
      insertFunc = 'insertBefore'
    $(opts.tabsItemHTML).html(title + opts.closeHTML)[insertFunc] itemTarget
    $(opts.contentHTML).addClass('uiTabsContent uiHidden').append(contentObj)[insertFunc] itemTarget
    opts.tabsItemTotal++
    return tabsObj
  ###*
   * [activate description]
   * @param  {[Integer]} {[Optional]} index [description]
   * @return {[Tabs]}       [description]
  ###
  activate : (index) ->
    tabsObj = @
    self = tabsObj.jqObj
    opts = tabsObj.opts
    if arguments.length is 0
      return opts.activateIndex
    $('>.uiTitleBar >.uiListContent .uiTabsItem', self).eq(index).trigger 'click.uiTabs'
    return tabsObj
  ###*
   * [item description]
   * @param  {[Integer]} {[Optional]} index   [description]
   * @param  {[String]} {[Optional]} content [description]
   * @param  {[String]} {[Optional]} title   [description]
   * @return {[jQuery, Tabs]}         [description]
  ###
  item : (index, content, title) ->
    tabsObj = @
    self = tabsObj.jqObj
    opts = tabsObj.opts
    index ?= 0
    item = $('>.uiTabsContent', self).eq index
    titleBar = $('> .uiTabsList > .uiListContent > .uiTabsItemContainer >.uiTabsItem', self).eq index
    if typeof content is 'undefined'
      return item
    if content?
      item.html content
    if typeof title is 'undefined'
      return titleBar
    titleBar.html title
    return tabsObj
###*
 * [initTabs description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initTabs = (self, opts) ->
  titleBarObj = $(opts.titleBarHTML).addClass(opts.titleBarClass).append opts.controlHTML
  self.addClas("uiTabs uiWidget #{opts.tabsClass}").children().each (n) ->
    closeHTML = ''
    if opts.closableArray is 'all' or (($.isArray opts.closableArray) and ($.inArray n, opts.closableArray) isnt -1)
      closeHTML = opts.closeHTML
    contentObj = ($ @).addClass 'uiTabsContent uiHidden'
    if $.isArray opts.titleList
      title = opts.titleList[n]
    title ?= content.attr 'title'
    $(opts.tabsItemHTML).html(title + closeHTML).appendTo $ '>.uiListContent >.uiTabsItemContainer', titleBarObj
    opts.tabsItemTotal++
  self.prepend titleBarObj
  tabsItemList = $ '> .uiTabsList > .uiListContent .uiTabsItem', self
  if opts.tabsItemWidth > 0
    tabsItemList.width opts.tabsItemWidth
  if opts.tabsItemMargin > -1
    tabsItemList.css 'marginLeft', opts.tabsItemMargin
  opts.tabsItemOuterWidth = tabsItemList.outerWidth true
  opts.tabsItemViewTotal = Math.floor ($ '>.uiTabsList', self).width() / opts.tabsItemOuterWidth
  if opts.tabsItemTotal > opts.tabsItemViewTotal
    $('> .uiTitleBar > .uiRightArrow', self).show()
  selfHeight = self.height()
  titleBarHeight = titleBarObj.height()
  if selfHeight > titleBarHeight
    contentObj = self.children '.uiTabsContent'
    contentObj.height selfHeight - titleBarHeight - (parseInt contentObj.css 'marginTop') - (parseInt contentObj.css 'marginBotto')
  initEvent self, opts
  return null
###*
 * [initEvent description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initEvent = (self, opts) ->
  $('> .uiTabsList > .uiListContent > .uiTabsItemContainer', self).on 'click.uiTabs', (e) ->
    target = $ e.target
    if target.hasClass 'uiCloseItemBtn'
      obj = target.parent '.uiTabsItem'
      if (opts.close self, obj, e) is false
        return false
      nextObj = obj.next()
      if nextObj.length isnt 0
        nextObj.click()
      else
        obj.prev().click()
      index = obj.index()
      self.children('.uiTabsContent').eq(index).remove()
      obj.remove()
      opts.tabsItemTotal--
      checkItemViewStatus self, opts
      return false
    else if target.hasClass 'uiTabsItem'
      index = target.addClass(opts.tabsItemSelectedClass).siblings('.selected').removeClass(opts.tabsItemSelectedClass).end().index()
      content = (self.children '.uiTabsContent').eq index
      if (opts.change self, target, content, e) is false
        return false
      content.removeClass('uiHidden').siblings('.uiTabsContent').addClass 'uiHidden'
      opts.activateIndex = index
  $('>.uiTitleBar', self).on 'click.uiTabs', (e) ->
    target = $ e.target
    if target.hasClass 'uiRightArrow'
      clickFunc = 'rightClick'
      opts.tabsItemViewIndex++
    else if target.hasClass 'uiLeftArrow'
      clickFunc = 'leftClick'
      opts.tabsItemViewIndex--
    if opts.tabsItemViewIndex < 0
      opts.tabsItemViewIndex = 0
      return
    else if opts.tabsItemTotal - opts.tabsItemViewTotal < opts.tabsItemViewIndex
      opts.tabsItemViewIndex = opts.tabsItemTotal - opts.tabsItemViewTotal
      return
    if clickFunc?
      if (opts[clickFunc] self, target, e) is false
        return false
      scrollLeftValue = opts.tabsItemOuterWidth * opts.tabsItemViewIndex
      target.siblings('.uiListContent').stop().animate {left : -scrollLeftValue}, opts.animateTime
      checkItemViewStatus self, opts
  $('>.uiTabsList', self).on 'mousewheel.uiTabs', (e, delta) ->
    if delta > 0
      $('>.uiLeftArrow', @).click()
    else
      $('>.uiRightArrow', @).click()
    return false
  $('> .uiTabsList > .uiListContent > .uiTabsItemContainer > .uiTabsItem', self).hover ()->
    $(@).addClass opts.tabsItemHoverClass
  ,() ->
    $(@).removeClass opts.tabsItemHoverClass
  return null
###*
 * [checkItemViewStatus description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
checkItemViewStatus = (self, opts) ->
  arrowRightObj = $ '> .uiTitleBar > .uiRightArrow', self
  arrowLeftObj = $ '> .uiTitleBar > .uiLeftArrow', self
  if opts.tabsItemTotal - opts.tabsItemViewTotal <= opts.tabsItemViewIndex
      arrowRightObj.hide()
  else
      arrowRightObj.show()
  if opts.tabsItemViewIndex <= 0
    arrowLeftObj.hide()
  else
    arrowLeftObj.show()
  return null
  