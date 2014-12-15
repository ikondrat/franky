module.exports = function( grunt ) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON( "package.json" ),
        build: {
            all: {
                dest: "dist/franky.js",
                minimum: [
                    "core"
                ]
            }
        },
        docco: {
            all: {
                src: ['dist/franky.js'],
                options: {
                    output: 'docs/'
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: '**/*'
        }
    });

    grunt.loadTasks( "build/tasks" );
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Rule for generate documentation
    grunt.registerTask( "doc", ["default", "docco:*:*", "gh-pages:*:*"] );

    // Default grunt
    grunt.registerTask( "default", ["build:*:*"] );
};