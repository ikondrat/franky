define([
    "./../core"
], function( franky ) {
    // Register as a named AMD module
    if ( typeof define === "function" && define.amd ) {
        define( "franky", [], function() {
            return franky;
        });
    }
});