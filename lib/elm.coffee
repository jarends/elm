{elm}   = require './elm_core_all.js'
ElmView = require './elm-view'
remote  = require 'remote'
app     = remote.require 'app'

if(!elm.window)
    elm.context = new elm.ElmContext('Elm[' + Math.random() + ']', app)
    elm.context.startup();

module.exports =
    activate:(state) ->

        atom.workspace.addOpener (uri) =>
            if uri.endsWith("wbt.json")
                return new ElmView({uri:uri})

    deactivate: ->
        if elm.context
            elm.context.dispose()
