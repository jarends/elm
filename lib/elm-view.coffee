{ScrollView} = require 'atom-space-pen-views'
{minto, elm, JSDictionary} = require './elm_core_all.js'

fs = require 'fs'

module.exports =
class ElmView extends ScrollView

    atom.deserializers.add(@)

    elm:null
    wbt:null
    uri:null
    name:null

    @content: ->
        @div class:"elm"

    initialize: (data) ->
        super
        #console.log("initialize: data = ", data)
        @uri  = data.uri
        @name = 'ElmView!! (hardcore) - ' + @uri
        fs.readFile @uri, 'utf-8', (err, data) =>
            if err
                throw err
            @wbt = JSON.parse(data)
            @elm = new elm.Abelm(@uri, @wbt, @element)

    serialize: ->
        deserializer: 'ElmView'
        data:
            uri: @uri

    @deserialize: ({data}) =>
        new ElmView(data)

    isEqual: (other) ->
        other instanceof ElmView

    getTitle: -> @name

    getUri: -> @uri
