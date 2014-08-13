/* global x, QUnit */
/* jshint multistr: true */
(function(q) {
    "use strict";

    q.module('franky');

    test('x.dataset', function() {
        var el = document.createElement('div'),
            testData = "";

        el.setAttribute("data-var1", "hello");
        el.setAttribute("data-var2", "world");
        el.setAttribute("data-var3", "againt");

        var data = x.dataset(el);
        equal(
            data.var1,
            "hello"
        );
        equal(
            data.var1 + " " + data.var2,
            "hello world"
        );
        equal(
            data.someUndefined,
            undefined
        );
    });

})(QUnit);
