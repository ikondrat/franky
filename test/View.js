/* global x, equal, ok */
/* jshint multistr: true */
(function() {
    "use strict";

    QUnit.module('franky');
    x.views.
        let("helloName", "hello [% name %]").
        let("helloNameDef", "hello [% name %]", {
            name: 'Karl'
        });

    test('helloName widthout data', function() {
        equal(
            x.views.get("helloName"),
            "hello ",
            'helloName widthout data failed'
        );
    });

    test('helloName with passed data', function() {
        equal(
            x.views.get("helloName", {name: 'Mark'}),
            "hello Mark",
            'helloName with passed data failed'
        );
    });

    test('helloName with default value', function() {
        equal(
            x.views.get("helloNameDef"),
            "hello Karl",
            'helloName with default value widthout data failed'
        );
    });

    x.views.setParseRe(/{{\s+([^}]+)\s+}}/g);

    x.views.parseRules.test = function (key) {
        return function (d) {
            return key + d.x;
        };
    };

    x.views.
        let("test", "hello world").
        let("test2", "here is {{ variable }} something for {{ variable2 }}").
        let("testOlolo", "here is {{ test:something }}").
        let("testJpath", "here is {{ jpath:x.y.z }}").
        let("t1", "blah blah {{ view:t2 }}").
        let("t2", "blah blah {{ view:t3 }}").
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

    x.views.
        let("t1", "blah blah {{ view:t2 }}").
        let("t2", "blah blah {{ view:t3 }}").
        let("t3", "blah blah");

    test('inherit', function() {
        var customViews = new x.View(x.views);
        customViews.let("t3", "oops");
        
        equal(
            customViews.get("t1", {views:customViews}),
            "blah blah blah blah oops",
            "basic inheritance failed"
        );

    });

    test('document', function() {
        x.views.
            let('document', '{{ doctype }}<html{{ document-attrs }}><head>{{ head }}</head><body{{ body-attrs }}>{{ body-content }}</body></html>').
            let('head', '<title>{{ title }}</title>{{ styles }}{{ scripts }}').
            let('doctype', '<!DOCTYPE html>').
            let('document-attrs', ' lang="ru"').
            let('body-content', 'hello world').
            let('title', 'base title').
            let('styles', '<style>body {font-size: 1em;}</style>').
            let('scripts', '<script>alert("hello world")</script>').
            let('body-attrs', ' class="b-page"');

        var customViews = new x.View(x.views);

        equal(
            customViews.get("document", {views:customViews}),
            '<!DOCTYPE html><html lang="ru">' +
                '<head>' +
                    '<title>base title</title>' +
                    '<style>body {font-size: 1em;}</style>' +
                    '<script>alert("hello world")</script>' +
                '</head><body class="b-page">hello world</body></html>',
            "document base test failed"
        );

        customViews.let("t3", "oops").
            let("title", "modified title").
            let("body-content", "Meine lieben Augustin");

        equal(
            customViews.get("document", {views:customViews}),
            '<!DOCTYPE html><html lang="ru"><head><title>modified title</title><style>body {font-size: 1em;}</style><script>alert("hello world")</script></head><body class="b-page">Meine lieben Augustin</body></html>',
            "document test failed"
        );

        var extraCustomViews = new x.View(customViews);
        extraCustomViews.let("title", "uber title");

        equal(
            customViews.get("document", {views:extraCustomViews}),
            '<!DOCTYPE html><html lang="ru"><head><title>uber title</title><style>body {font-size: 1em;}</style><script>alert("hello world")</script></head><body class="b-page">Meine lieben Augustin</body></html>',
            "extraCustomViews document test failed"
        );

    });

})();