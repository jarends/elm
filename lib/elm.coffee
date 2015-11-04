ElmView = require './elm-view'
module.exports =
    activate:(state) ->
        atom.workspace.addOpener (uri) =>
            if uri.endsWith("wbt.json")
                return new ElmView({uri:uri})
