/* global x, equal, ok */
/* jshint multistr: true */
(function() {
    "use strict";

    x.views.parseRules.test = function (key) {
        return function (d) {
            return key + d.x;
        };
    };

    x.views.
        let("test", "hello world").
        let("test2", "here is [% variable %] something for [% variable2 %]").
        let("testOlolo", "here is [% test:something %]").
        let("testJpath", "here is [% jpath:x.y.z %]").
        let("t1", "blah blah [% view:t2 %]").
        let("t2", "blah blah [% view:t3 %]").
        let("t3", "blah blah");

    test('simple', function() {

        equal(
            x.views.get("test"),
            "hello world"
        );
    });

    test('variables', function() {

        equal(
            x.views.get("test2", {
                "variable": "exists",
                "variable2": "me"
            }),
            "here is exists something for me"
        );

    });

    test('rules', function() {

        equal(
            x.views.get("testOlolo", {
                x: "blah"
            }),
            "here is somethingblah"
        );

    });

    test('jpath', function() {

        equal(
            x.views.get("testJpath", {
                x: {
                    y: {
                        z: "hopla"
                    }
                }
            }),
            "here is hopla"
        );

    });


    test('view rule', function() {
        
        equal(
            x.views.get("t1"),
            "blah blah blah blah blah blah"
        );

    });
/*
    test('inherit', function() {
        var customViews = new x.View(x.views);
        customViews.let("t3", "oops");
        
        equal(
            customViews.get("t1"),
            "blah blah blah blah oops"
        );

        equal(
            x.views.get("t1"),
            "blah blah blah blah blah blah"
        );

    });
*/
})();
