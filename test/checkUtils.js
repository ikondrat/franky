/* global x, equal, ok */
/* jshint multistr: true */
(function() {
    "use strict";
  
    if (typeof module === "function") {
        module("franky");
    }

    var arr = [2,3,4],
        arrLike = {},
        obj = {
            x: 1,
            y: 2
        };
    Array.prototype.push.call(arrLike, 1);

    test('isArray', function() {
        ok(
            x.isArray(arr),
            "isArray with array argument must return true"
        );
        ok(
            !x.isArray(arrLike),
            "isArray with arrayLike argument must return false"
        );
        ok(
            !x.isArray(obj),
            "isArray with object argument must return false"
        );
        ok(
            x.isArrayLike(arrLike),
            "isArrayLike with arrayLike argument must return true"
        );
        ok(
            !x.isArrayLike(obj),
            "isArrayLike with arrayLike argument must return false"
        );
        ok(
            !x.isArrayLike(arr),
            "isArrayLike with array argument must return false"
        );
    });

    test('isFunc', function () {
        ok(
            x.isFunc(function(){}),
            'isFunc single argument usage'
        );
        ok(
            !x.isFunc({}),
            'isFunc not a func'
        );
        ok(
            !x.isFunc(true),
            'isFunc not a func 2'
        );
        ok(
            x.isFunc(Function.prototype.call, String.prototype.indexOf),
            'isFunc multiple argument usage'
        );
    });

})();
