'use strict';

module.exports = function(grunt)
{

    grunt.initConfig(
    {
        //     0000000  000      00000000   0000000   000   000
        //    000       000      000       000   000  0000  000
        //    000       000      0000000   000000000  000 0 000
        //    000       000      000       000   000  000  0000
        //     0000000  0000000  00000000  000   000  000   000

        clean:
        {
            lib:
            {
                src:["lib/elm_core.js"]
            },

            js:
            {
                src:["ts/**/*.js", "ts/**/*.map"]
            }
        },


        //    000000000  000   000  00000000   00000000   0000000   0000000  00000000   000  00000000   000000000
        //       000      000 000   000   000  000       000       000       000   000  000  000   000     000
        //       000       00000    00000000   0000000   0000000   000       0000000    000  00000000      000
        //       000        000     000        000            000  000       000   000  000  000           000
        //       000        000     000        00000000  0000000    0000000  000   000  000  000           000

        typescript:
        {
            elm:
            {
                src:  ['ts/elm/references.ts'],
                dest: 'lib/elm_core.js',
                options:
                {
                    target:         'es5', //or es3
                    rootDir:        'ts/elm/',
                    sourceMap:      false,
                    declaration:    true,
                    removeComments: true,
                }
            }
        },


        //     0000000   0000000   000      000000000
        //    000       000   000  000         000
        //    0000000   000000000  000         000
        //         000  000   000  000         000
        //    0000000   000   000  0000000     000

        salt:
        {
            options:
            {
                dryrun:  false,
                quiet:   true,
                verbose: false
            },
            all:
            {
                options:
                {
                    textMarker:  "//>",
                    textPrefix:  null,
                    textFill:    "//    ",
                    textPostfix: null,
                },
                files:
                {
                    asciiText:["./**/*.ts", "./Gruntfile.js"]
                }
            }
        },


        //    00     00   0000000   00000000    0000000  000   000   0000000   000
        //    000   000  000   000  000   000  000       000   000  000   000  000
        //    000000000  000000000  0000000    0000000   000000000  000000000  000
        //    000 0 000  000   000  000   000       000  000   000  000   000  000
        //    000   000  000   000  000   000  0000000   000   000  000   000  0000000

        marshal:
        {
            elm:
            {
                src:       ["ts/elm/**/*.ts"],
                dest:      "ts/elm/references.ts",
                externals: ["ts/elm/external.ts"]
            }
        },


        //    000   000   0000000   000000000   0000000  000   000
        //    000 0 000  000   000     000     000       000   000
        //    000000000  000000000     000     000       000000000
        //    000   000  000   000     000     000       000   000
        //    00     00  000   000     000      0000000  000   000

        watch:
        {
            salt:
            {
                files: ["./ts/**/*.ts", "./Gruntfile.js"],
                tasks: ["salt:all"],
                options:
                {
                    spawn: false,
                },
            },
            elm:
            {
                files: ["./ts/**/*.ts", "!./ts/**/references.ts"],
                tasks: ["marshal:elm", "typescript:elm", "mrequire:elm"],
                options:
                {
                    spawn: false,
                },
            }
        },


        //    00     00  00000000   00000000   0000000   000   000  000  00000000   00000000
        //    000   000  000   000  000       000   000  000   000  000  000   000  000
        //    000000000  0000000    0000000   000 00 00  000   000  000  0000000    0000000
        //    000 0 000  000   000  000       000 0000   000   000  000  000   000  000
        //    000   000  000   000  00000000   00000 00   0000000   000  000   000  00000000

        mrequire:
        {
            elm:
            {
                options:
                {
                    exports: ["minto", "elm", "JSDictionary"],
                    dest: "./lib/elm_core_all.js"
                },
                src:
                [
                    "./bower/minto/libs/jsdictionary/jsdictionary.js",
                    "./bower/minto/libs/minto/minto_core.js",
                    "./lib/elm_core.js"
                ]
            }
        },

    });




    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-marshal");
    grunt.loadNpmTasks("grunt-pepper");
    grunt.loadNpmTasks("grunt-typescript");



    //    00     00  00000000   00000000   0000000   000   000  000  00000000   00000000
    //    000   000  000   000  000       000   000  000   000  000  000   000  000
    //    000000000  0000000    0000000   000 00 00  000   000  000  0000000    0000000
    //    000 0 000  000   000  000       000 0000   000   000  000  000   000  000
    //    000   000  000   000  00000000   00000 00   0000000   000  000   000  00000000

    grunt.registerMultiTask("mrequire", "makes js require conform", function()
    {
        var fs = require("fs"),
            options = this.options({}),
            dest    = options.dest,
            exports = options.exports || [],
            s       = "",
            l       = exports ? exports.length : 0,
            i;

        this.filesSrc.forEach(function(filepath)
        {
            if(!grunt.file.exists(filepath))
                return;
            s += grunt.file.read(filepath) + "\r";
        });

        s += "module.exports = {"
        for(i = 0; i < l; ++i)
        {
            s += exports[i] + ":" + exports[i] + (i < l - 1 ? "," : "}\r");
        }

        s = "(function(window){" + s + "})(window);"
        grunt.file.write(dest, s);
    });


    //     0000000   0000000   00     00  00000000   000  000      00000000
    //    000       000   000  000   000  000   000  000  000      000
    //    000       000   000  000000000  00000000   000  000      0000000
    //    000       000   000  000 0 000  000        000  000      000
    //     0000000   0000000   000   000  000        000  0000000  00000000

    grunt.registerTask('compile',
    [
        "clean:lib",
        "marshal:elm",
        "typescript:elm",
        "mrequire:elm",
    ]);


    //    0000000    000   000  000  000      0000000
    //    000   000  000   000  000  000      000   000
    //    0000000    000   000  000  000      000   000
    //    000   000  000   000  000  000      000   000
    //    0000000     0000000   000  0000000  0000000

    grunt.registerTask('build',
    [
        "compile"
    ]);
};
