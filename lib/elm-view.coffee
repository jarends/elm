{ScrollView} = require 'atom-space-pen-views'
{elm}        = require './elm_core_all.js'
fs           = require 'fs'
remote       = require 'remote'
app          = remote.require 'app'

module.exports =
class ElmView extends ScrollView

    atom.deserializers.add(this)

    elm:null
    wbt:null
    uri:null
    id:null
    name:null

    @content: ->
        @div class:"elm"

    initialize: (data) ->
        super

        console.log("ElmView.initialize: " + ElmView.version)

        @uri  = data.uri
        @id   = data.id || 'ElmPanel[' + @uri + ', ' + Math.random() + ']'
        @name = 'elm ' + @uri
        @elm  = new elm.ElmPanel(@id, @element, app);

        fs.readFile @uri, 'utf-8', (err, data) =>
            if err
                throw err
            @wbt = JSON.parse(data)
            @elm.startup(@wbt);

    detached: ->
        @elm.detachLater();

    serialize: ->
        deserializer: 'ElmView'
        data:
            uri: @uri
            id:  @id

    @deserialize: ({data}) =>
        new ElmView(data)

    isEqual: (other) ->
        other instanceof ElmView and other.id == @id

    getTitle: -> @name

    getUri: -> @uri
