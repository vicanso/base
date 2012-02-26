$ = window.jQuery
$$ = window.BASE

$.fn.menu = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.Menu
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result

class $$.Menu extends $$.Widget
  constructor: (self, options) ->
    menuObj = @
    if not (menuObj instanceof $$.Menu)
      return new $$.Menu self, options
    defaults =
      topMenuClass : $$.defaultGradientBG
      subMenuClass : "#{$$.defaultGradientBG} uiCornerAll #{$$.defaultBorder}"
      hoverClass : $$.hoverGradientBG
    
    opts = $.extend defaults, options
    menuObj.constructor.__super__.constructor.call menuObj, self, opts
    menuObj.init()
  init : () ->
    menuObj = @
    menuObj.createWidget()
    initMenu menuObj.jqObj, menuObj.opts
    return menuObj
initMenu = (self, opts) ->
  topLevelListObj = self.addClass("uiMenu uiWidget #{opts.topMenuClass}").children 'ul'
  topLevelListObj.addClass('uiTopLevel').children('li:not(:last)').addClass 'uiRightBorder'
  topLevelListObj.find('ul').addClass("uiSubLevel #{opts.subMenuClass}").children('li:not(::last-child)').children('a').addClass 'uiBottomBorder'
  topMenuWidth = 0
  $('>li', topLevelListObj).each () ->
    topMenuWidth += ($ @).outerWidth true
  topLevelListObj.width topMenuWidth
  initEvent self, opts
initEvent = (self, opts) ->
  self.find('li').hover ()->
    $(@).addClass opts.hoverClass
  ,() ->
    $(@).removeClass opts.hoverClass
