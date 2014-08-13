/* global x */
/* jshint multistr: true */
(function (q) {
    "use strict";
    var testVariable;

    q.module('franky');

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

    q.test('Components: custom call of init', function() {
        x.Component.initById("aaa");
        q.equal(
            testVariable,
            123,
            "The result must be 123"
        );
    });

    q.test('Components: check init', function() {
        var doc = document.createElement('div'),
            testData = "";

        doc.setAttribute("data-xapp", "hello");
        doc.setAttribute("data-var1", "hello");
        doc.setAttribute("data-var2", "world");

        x.Component.extend({
            'id': "hello",
            'init': function () {
                testData = this.var1 + " " + this.var2;
            }
        });
        x.Component.initByHTML(doc);
        q.equal(
            testData,
            "hello world",
            "check init failed"
        );
    });

})(QUnit);
