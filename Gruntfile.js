module.exports = function( grunt ) {
    "use strict";

    /*function readOptionalJSON( filepath ) {
        var data = {};
        try {
            data = grunt.file.readJSON( filepath );
        } catch ( e ) {}
        return data;
    }

    var gzip = require( "gzip-js" ),
        srcHintOptions = readOptionalJSON( "src/.jshintrc" );

    // The concatenated file won't pass onevar
    // But our modules can
    delete srcHintOptions.onevar;
*/
    grunt.initConfig({
        pkg: grunt.file.readJSON( "package.json" ),
        build: {
            all: {
                dest: "dist/franky.js",
                minimum: [
                    "core",
                    "selector"
                ],
                // Exclude specified modules if the module matching the key is removed
                removeWith: {
                    ajax: [ "manipulation/_evalUrl", "event/ajax" ],
                    callbacks: [ "deferred" ],
                    css: [ "effects", "dimensions", "offset" ],
                    sizzle: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
                }
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

    // Load grunt tasks from NPM packages
    //require( "load-grunt-tasks" )( grunt );

    // Integrate jQuery specific tasks
    grunt.loadTasks( "build/tasks" );

    grunt.loadNpmTasks('grunt-docco');

    grunt.loadNpmTasks('grunt-gh-pages');
    //grunt.registerTask( "lint", [ "jshint", "jscs" ] );

    // Short list as a high frequency watch task
    //grunt.registerTask( "dev", [ "build:*:*", "lint" ] );
    //grunt.registerTask( "dev", ["build:*:*","docco:*:*","gh-pages:*:*"] );
    grunt.registerTask( "dev", ["build:*:*"] );

    // Default grunt
    // grunt.registerTask( "default", [ "jsonlint", "dev", "uglify", "dist:*", "compare_size" ] );
    grunt.registerTask( "default", ["dev"] );
};
