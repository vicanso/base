(function() {
  var $, $$, setPosByObject, setPosByStr;

  $ = window.jQuery;

  $$ = window.BASE;

  /**
   * [moveToPos description]
   * @param  {[Object]} options [description]
   * @return {[jQuery]}         [description]
  */


  $.fn.moveToPos = function(options) {
    var positionObj, self;
    self = this;
    positionObj = new $$.Position(self);
    positionObj.moveToPos(options);
    return self;
  };

  $$.Position = (function() {
    /**
     * [constructor description]
     * @param  {[jQuery]} self    [description]
     * @param  {[Object]} {[Optional]} options [description]
     * @return {[Position]}         [description]
    */

    function Position(self, options) {
      var defaults, positionObj;
      positionObj = this;
      if (!(positionObj instanceof $$.Position)) {
        return new $$.Position(self, options);
      }
      positionObj.opts = {};
      defaults = {
        returnOldPos: false,
        oldPos: null
      };
      $.extend(positionObj.opts, defaults, options);
      positionObj.jqObj = self;
    }

    /**
     * [moveToPos description]
     * @param  {[Object]} position [description]
     * @return {[Object]}          [description]
    */


    Position.prototype.moveToPos = function(position) {
      var oldPos, opts, positionObj, returnValue, self;
      positionObj = this;
      self = positionObj.jqObj;
      opts = positionObj.opts;
      oldPos = {
        position: null,
        left: null,
        top: null,
        right: null,
        bottom: null
      };
      self.css('margin', 0);
      if (opts.returnOldPos) {
        $.each(oldPos, function(key) {
          return oldPos[key] = self.css(key);
        });
        returnValue = oldPos;
      } else {
        returnValue = positionObj;
      }
      if (position === void 0) {
        position = opts.position;
      }
      if (typeof position === 'string') {
        setPosByStr(self, position);
      } else if ($.isPlainObject(position)) {
        setPosByObject(self, position);
      }
      return returnValue;
    };

    return Position;

  })();

  /**
   * [setPosByStr description]
   * @param {[jQuery]} self   [description]
   * @param {[String]} posStr [description]
  */


  setPosByStr = function(self, posStr) {
    var parentHeight, parentObj, parentOffset, parentWidth, posSetting, propFunc, targetHeight, targetWidth, windowHeight, windowObj, windowWidth;
    windowObj = $(window);
    parentObj = self.parent();
    propFunc = $.prop ? 'prop' : 'attr';
    if ((parentObj[propFunc]('tagName')).toUpperCase() === 'BODY') {
      parentObj = windowObj;
    }
    windowWidth = windowObj.width();
    windowHeight = windowObj.height();
    parentWidth = parentObj.width();
    parentHeight = parentObj.height();
    targetWidth = self.outerWidth();
    targetHeight = self.outerHeight();
    posSetting = {
      position: 'absolute',
      left: null,
      top: null,
      right: null,
      bottom: null
    };
    parentOffset = self.parent().offset();
    if ((self.css('position')) === 'fixed') {
      posSetting.position = 'fixed';
    }
    switch (posStr.toLowerCase()) {
      case 'center':
        parentWidth = Math.max(Math.min(parentWidth, windowWidth), targetWidth);
        parentHeight = Math.max(Math.min(parentHeight, windowHeight), targetHeight);
        posSetting['left'] = parentOffset.left + (parentWidth - targetWidth) / 2;
        posSetting["top"] = parentOffset.top + (parentHeight - targetHeight) / 2 + ($(document)).scrollTop();
        break;
      case 'leftbottom':
        posSetting["left"] = posSetting["bottom"] = 0;
        break;
      case 'lefttop':
        posSetting["left"] = posSetting["top"] = 0;
        break;
      case 'righttop':
        posSetting["right"] = posSetting["top"] = 0;
        break;
      case 'rightbottom':
        posSetting["right"] = posSetting["bottom"] = 0;
        break;
      default:
        posSetting[posStr] = 0;
    }
    self.css(posSetting);
    return null;
  };

  /**
   * [setPosByObject description]
   * @param {[jQuery]} self [description]
   * @param {[Object]} pos  [description]
  */


  setPosByObject = function(self, pos) {
    var posSetting;
    posSetting = {
      position: 'absolute',
      left: null,
      top: null,
      right: null,
      bottom: null
    };
    $.extend(posSetting, pos);
    if (self.css('position' === 'fixed')) {
      posSetting.position = "fixed";
    }
    self.css(posSetting);
    return null;
  };

}).call(this);
