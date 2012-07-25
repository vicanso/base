$ = window.jQuery
$$ = window.BASE
###*
 * [dropDownList description]
 * @param  {[Obejct]} options [description]
 * @return {[jQuery, Others]}         [description]
###
$.fn.dropDownList = (options) ->
  self = this
  args = Array.prototype.slice.call arguments
  args.push $$.DropDownList
  result = $$.createWidgetByJQuery.apply self, args
  if result.jqObj? and options isnt 'widget'
    return self
  return result
class $$.DropDownList extends $$.Widget
  ###*
   * [constructor description]
   * @param  {[jQuery]} self    [description]
   * @param  {[Object]} {[Optional]} options [description]
   * @return {[DropDownList]}         [description]
  ###
  constructor: (self, options) ->
    dropDownListObj = @
    if not (dropDownListObj instanceof $$.DropDownList)
      return new $$.DropDownList self, options

    defaults =
      dropDownListClass : "#{$$.defaultGradientBG}  uiCornerAll #{$$.defaultBorder}"
      selectListClass : "#{$$.defaultGradientBG} uiCornerAll uiBlackBorder uiBlackBoxShadow"
      pageSize : 5
      showAll : false
      multiple : false
      dropListType : 'normal'
      searchTip : '查找/search'
      hasScrollBar : false
      listItemHoverClass : $$.hoverGradientBG
      divideChar : ";"
      click : $.noop
      change : $.noop
      input : $.noop
      blur : $.noop
      focus : $.noop
      selectItemTotal : 0
      listItemOuterHeight : 0
      dropDownHTML : '<div class="uiDropDown">
                      <div class="uiDropDownBtn uiSmallIcon uiDropdownButtonIcon uiBlackBorder"></div>
                  </div>',
      selectListHTML : '<div class="uiSelectList"></div>'
      noListDataHTML : '<li style="font-size:12px;">无数据项..</li>'
    
    opts = $.extend {}, defaults, options
    dropDownListObj.constructor.__super__.constructor.call dropDownListObj, self, opts
    dropDownListObj.init()
  ###*
   * [init description]
   * @return {[DropDownList]} [description]
  ###
  init : () ->
    dropDownListObj = @
    dropDownListObj.createWidget()
    initDropDownList dropDownListObj.jqObj, dropDownListObj.opts
    return dropDownListObj
  ###*
   * [selectedItem description]
   * @param  {[Integer]} {[Optional]} index [description]
   * @return {[jQuery, DropDownList]}       [description]
  ###
  selectedItem : (index) ->
    dropDownListObj = @
    self = dropDownListObj.jqObj
    opts = dropDownListObj.opts
    if arguments.length is 0
      return $ '>.uiSelectList>.selected', self
    $("> .uiSelectList > li:eq(#{index})", self).click();
    return dropDownListObj
  ###*
   * [list description]
   * @param  {[String, Array, DOM, jQuery]} list [description]
   * @return {[jQuery, DropDownList]}      [description]
  ###
  list : (list) ->
    dropDownListObj = @
    self = dropDownListObj.jqObj
    opts = dropDownListObj.opts
    selectList = $ '.uiSelectList', self
    if arguments.length is 0
      return selectList.children()
    selectList.empty();
    if typeof list is 'string'
      selectList.html list
    else if $.isArray list
      if list.length is 0
        selectList.append opts.noListDataHTML
      else
        selectList.append "<li>#{item}</li>" for item in list
    else
      selectList.append list
    listItemObj = selectList.find '>li'
    opts.selectItemTotal = listItemObj.length
    if opts.multiple
      listItemObj.prepend '<span class="uiSmallIcon uiSelectedIcon uiSelected"></span>'
    listShowTotal = opts.pageSize
    if opts.showAll or opts.pageSize > opts.selectItemTotal
      listShowTotal = opts.selectItemTotal
    if opts.listItemOuterHeight is 0
      opts.listItemOuterHeight = listItemObj.outerHeight true
    selectList.height opts.listItemOuterHeight * listShowTotal
    $('>.uiSelectList >li', self).hover ()->
      ($ @).addClass opts.listItemHoverClass
    ,() ->
        ($ @).removeClass opts.listItemHoverClass
    return dropDownListObj
  ###*
   * [showSelectList description]
   * @return {[DropDownList]} [description]
  ###
  showSelectList : () ->
    dropDownListObj = @
    self = dropDownListObj.jqObj
    opts = dropDownListObj.opts
    self.children('.uiSelectList').show()
    return dropDownListObj
  ###*
   * [hideSelectList description]
   * @return {[DropDownList]} [description]
  ###
  hideSelectList : () ->
    dropDownListObj = @
    self = dropDownListObj.jqObj
    opts = dropDownListObj.opts
    self.children('.uiSelectList').hide()
    return dropDownListObj
  ###*
   * [val description]
   * @return {[Array]} [description]
  ###
  val : () ->
    dropDownListObj = @
    self = dropDownListObj.jqObj
    opts = dropDownListObj.opts
    selectedValue = []
    self.find('>.uiSelectList >.selected').each () ->
      selectedValue.push $(@).text()
    return selectedValue
###*
 * [initDropDownList description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initDropDownList = (self, opts) ->
  multiple = if opts.multiple then 'uiMultiple' else ''
  selectList = self.children().addClass "#{multiple} uiSelectList #{opts.selectListClass}"
  liItemList = $ '>li', selectList
  opts.selectItemTotal = liItemList.length
  dropDown = $ opts.dropDownHTML
  if opts.dropListType is 'search'
    dropDown.append "<input type=\"text\" value=\"#{opts.searchTip}\" class=\"uiCornerAll\" />"
  else
    dropDown.append '<span></span>'
  if opts.multiple
    liItemList.prepend '<span class="uiSmallIcon uiSelectedIcon uiSelected"></span>'
  self.prepend(dropDown).addClass "uiDorpDownList uiWidget #{opts.dropDownListClass}"
  if opts.dropListType is 'search'
    dropDown.children('input').width dropDown.width() - 2 * parseInt(dropDown.css('paddingLeft')) - dropDown.children('.uiDropDownBtn').outerWidth true
  if opts.showAll
    opts.pageSize = opts.selectItemTotal
  else
    opts.listItemOuterHeight = liItemList.outerHeight()
    selectList.height opts.listItemOuterHeight * opts.pageSize
  selectList.hide()
  initEvent self, opts
  return null
###*
 * [initEvent description]
 * @param  {[jQuery]} self [description]
 * @param  {[Object]} opts [description]
###
initEvent = (self, opts) ->
  selectedContent = $ '> .uiDropDown > span, > .uiDropDown > input', self
  $('>.uiDropDown', self).on 'click.uiDorpDownList', (e) ->
    obj = $ @
    if (opts.click self, obj, e) is false
      return false
    obj.siblings('.uiSelectList').slideToggle opts.animateTime
  #search的相关事件未添加
  selectList = $ '>.uiSelectList', self
  if opts.hasScrollBar
    selectList.scrollBar()
  else
    selectList.on 'mousewheel.uiDorpDownList', (e, delta) ->
      obj = $ @
      if $('>li', obj).length <= opts.pageSize
        return ;
      if delta < 0
        showLiItem = $ '>li:not(:hidden):first', obj
        if showLiItem.nextAll('li').length >= opts.pageSize
          showLiItem.hide()
      else
        $('>li:hidden:last', obj).show()
      return false
  selectList.on 'click.uiDorpDownList', (e) ->
    obj = $ @
    target = $ e.target
    propFunc = if $.prop then 'prop' else 'attr'
    if target[propFunc]('tagName').toUpperCase() isnt 'LI'
      target = target.parent 'li'
      if target.length is 0
        return
    selectedValue = target.toggleClass('selected').text()
    if opts.multiple
      selectedValue = ''
      obj.children('.selected').each () ->
        selectedValue += ($(@).text() + opts.divideChar)
      selectedValue = selectedValue.substring 0, selectedValue.length - 1
    else
      obj.slideUp()
    if opts.dropListType is 'search'
      selectedContent.val selectedValue
    else
      selectedContent.html selectedValue
    if (opts.change self, obj, selectedValue, e) is false
      return false
  $('> .uiSelectList > li', self).hover () ->
    $(@).addClass opts.listItemHoverClass
  ,() ->
    $(@).removeClass opts.listItemHoverClass
  return null
