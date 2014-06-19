/* global x, equal, ok */
/* jshint multistr: true */
(function() {
    "use strict";
    var testVariable;

    QUnit.module('franky');

    x.Component.extend({
        id: "aaa",
        init: function () {
            testVariable = 123;
        }
    });

    x.Component.extend({
        id: "yyy",
        init: function () {
            testVariable = this.data("value") || 222;
        }
    });

    test('Components: custom call of init', function() {
        x.Component.initById("aaa");
        equal(
            testVariable,
            123,
            "The result must be 123"
        );
    });

    /*
    if (typeof document !== "undefined") {
        test('Components: initByHTML', function() {
            x.Component.initByHTML();
            equal(
                testVariable,
                "olollo",
                "The result must be 123"
            );
        });
    }
    */


})();
