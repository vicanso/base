_ = require 'underscore'
Path = require 'path'
Fs = require 'fs'


MergerFiles = 
  getMergerFile : (file, type) ->
    self = @
    mergerFile = ''
    if type is 'css'
      searchFiles = self.cssList
    else
      searchFiles = self.jsList
    _.each searchFiles, (files) ->
      if not mergerFile && (_.indexOf files, file) isnt -1
        mergerFile = files[0]
    return mergerFile
  js : [
    {
      combine :
        file : '/js/jquery.base.js'
      core : 
        file : '/js/jquery.base.core.js'
        index : 0
      widget : 
        file : '/js/jquery.base.widget.js'
        index : 1
      loader : 
        file : '/js/jquery.base.loader.js'
        index : 2
      effect : 
        file : '/js/jquery.base.effect.js'
        index : 3
      position : 
        file : '/js/jquery.base.position.js'
        index : 4
      interaction : 
        file : '/js/jquery.base.interaction.js'
        index : 5
      buttonset : 
        file : '/js/jquery.base.buttonset.js'
        index : 6
      accordion : 
        file : '/js/jquery.base.accordion.js'
        index : 7
      dialog : 
        file : '/js/jquery.base.dialog.js'
        index : 8
      dropdownlist : 
        file : '/js/jquery.base.dropdownlist.js'
        index : 9
      list : 
        file : '/js/jquery.base.list.js'
        index : 10
      menu : 
        file : '/js/jquery.base.menu.js'
        index : 11
      progressbar : 
        file : '/js/jquery.base.progressbar.js'
        index : 12
      slide : 
        file : '/js/jquery.base.slide.js'
        index : 13
      tabs : 
        file : '/js/jquery.base.tabs.js'
        index : 14
      tip : 
        file : '/js/jquery.base.tip.js'
        index : 15
    }
  ]
  css : [
    {
      combine : 
        file : '/css/theme/jquery.base.min.css'
      theme : 
        file : '/css/theme/jquery.base.theme.css'
        index : 0
      interaction : 
        file : '/css/theme/jquery.base.interaction.css'
        index : 1
      accordion : 
        file : '/css/theme/jquery.base.accordion.css'
        index : 2
      buttonset : 
        file : '/css/theme/jquery.base.buttonset.css'
        index : 3
      dialog : 
        file : '/css/theme/jquery.base.dialog.css'
        index : 4
      dropdownlist : 
        file : '/css/theme/jquery.base.dropdownlist.css'
        index : 5
      list : 
        file : '/css/theme/jquery.base.list.css'
        index : 6
      menu : 
        file : '/css/theme/jquery.base.menu.css'
        index : 7
      progressbar : 
        file : '/css/theme/jquery.base.progressbar.css'
        index : 8
      slide : 
        file : '/css/theme/jquery.base.slide.css'
        index : 9
      tabs : 
        file : '/css/theme/jquery.base.tabs.css'
        index : 10
      tip : 
        file : '/css/theme/jquery.base.tip.css'
        index : 11
    }
  ]

_.each MergerFiles, (mergerInfo, mergerType) ->
  if _.isArray mergerInfo
    mergeList = []
    _.each mergerInfo, (mergers) ->
      fileName = 'vicanso'
      combineFileName = ''
      filePathList = []
      _.each mergers, (fileInfo, key) ->
        fileName += "_#{key}"
        if key is 'combine'
          combineFileName = fileInfo.file
        else if fileInfo.index?
          filePathList[fileInfo.index] = fileInfo.file
      if filePathList.length isnt 0
        if combineFileName
          fileName = combineFileName
        else
          fileName = "/mergers/#{fileName}.#{mergerType}"
        mergeList.push [fileName].concat _.compact filePathList
    _.each mergeList, (files) ->
      filePath = "#{__dirname}/"
      saveFile = Path.join filePath, files[0]
      content = ''
      _.each files, (file, i) ->
        if i isnt 0
          content +=  Fs.readFileSync Path.join filePath, file
      Fs.writeFileSync saveFile, content
    MergerFiles["#{mergerType}List"] = mergeList
delete MergerFiles.js
delete MergerFiles.css