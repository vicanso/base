$$ = window.BASE
$ = window.jQuery
###*
 * [WIDGET_CALL_FUNCTION description]
 * @type {[type]}
###
WIDGET_CALL_FUNCTION = $$.WIDGET_CALL_FUNCTION = {
  baseUrl : "./javascript/jquery.base.{key}.js"
}
WIDGET_LIST = 'accordion buttonSet datePicker dialog dropDownList grid list menu progressBar slide tabs tip tree'.split ' '
for widget in WIDGET_LIST
  do (widget) ->
    if not $.isFunction $.fn[widget]
      argumentsList = []
      key = widget
      widgetJSON = {
        argumentsList : argumentsList
        loading : false
      }
      WIDGET_CALL_FUNCTION[key] = widgetJSON
      $.fn[key] = () ->
        if not widgetJSON.loading
          $.ajax {
            url : WIDGET_CALL_FUNCTION.baseUrl.replace '{key}', key
            dataType : 'script'
            success : (data) ->
              for args in argumentsList
                $.fn[key].apply args.pop(), args
              delete WIDGET_CALL_FUNCTION[key]
          }