module.exports = function( grunt ) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON( "package.json" ),
        build: {
            all: {
                dest: "lib/franky.js",
                minimum: [
                    "core"
                ]
            }
        },
        docco: {
            all: {
                src: ['lib/franky.js'],
                options: {
                    output: 'doc/'
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'doc'
            },
            src: '**/*'
        },
        uglify: {
            all: {
                files: {
                    "lib/franky.min.js": [ "lib/franky.js" ]
                },
                options: {
                    preserveComments: false,
                    sourceMap: true,
                    sourceMapName: "lib/franky.min.map",
                    report: "min",
                    beautify: {
                        "ascii_only": true
                    },
                    banner: "/*! Franky v<%= pkg.version %> | " +
                    "(c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %> */",
                    compress: {
                        "hoist_funs": false,
                        loops: false,
                        unused: false
                    }
                }
            }
        }
    });

    grunt.loadTasks( "build/tasks" );
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Rule for generate documentation
    grunt.registerTask( "doc", ["default", "docco:*:*"] );

    // Distribute documentation
    grunt.registerTask( "update-doc", ["doc", "gh-pages:*:*"] );

    // Default grunt
    grunt.registerTask( "default", ["build:*:*", "uglify"] );
};