/*!
 * Franky JavaScript Library v@VERSION
 *
 * (c) 2013-2014 Kondrat Shmoylov
 * Franky may be freely distributed under the MIT license.
 * For all details and documentation:
 * github.com/ikondrat/franky
 *
 * Date: @DATE
 */

(function (global, factory) {

    if (typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(global);
    } else {
        factory(global);
    }

// Pass this if global is not defined yet
}(typeof global !== "undefined" ? global : this, function( global ) {