/* global x, equal, ok, throws*/
/* jshint multistr: true */
(function() {
    "use strict";

    QUnit.module('franky');

    test('trim', function() {
        equal(
            x.trim(" a  a "),
            "a  a"
            );
    });

    test('stripSpaces', function () {
        equal(
            x.stripSpaces("blah     blah  blah 11"),
            "blahblahblah11"
        );
        equal(
            x.stripSpaces(" blah    blah  "),
            "blahblah"
        );
    });

    test('isURL', function () {

        ok(
            x.isURL("http://www.yandex.ru/?s=1"),
            "http://www.yandex.ru/?s=1 must be matched as URL"
        );

        ok(
            x.isURL("https://www.google.com/path/#aaa"),
            "https://www.google.com/path/#aaa must be matched as URL"
        );

        ok(
            !x.isURL("12234"),
            "12234 isn't an URL at all"
        );

        ok(
            !x.isURL("//ololo.org"),
            "//ololo.org isn't fully appreciated URL"
        );

        throws(
            function () {
                x.isURL({a:1});
            },
            "Only strings parameters are allowed"
        );

        throws(
            function () {
                x.isURL(function(){});
            },
            "Only strings parameters are allowed"
        );
    });

    test("test for x.constructURL", function () {

        equal(
            x.constructURL("http://www.yandex.ru", {
                "text": 1,
                "hello": "world"
            }),
            "http://www.yandex.ru?text=1&hello=world",
            "OK"
        );

        equal(
            x.constructURL("http://www.google.com?", {
                "search": "ololo",
                "test": "ok"
            }),
            "http://www.google.com?search=ololo&test=ok",
            "OK"
        );

        equal(
            x.constructURL("http://www.google.com?", {
                "text": ""
            }),
            "http://www.google.com?text=",
            "OK"
        );

        equal(
            x.constructURL("http://www.yandex.com/test/?vow=test", {
                "search": "ololo",
                "test": "ok"
            }),
            "http://www.yandex.com/test/?vow=test&search=ololo&test=ok",
            "OK"
        );

        equal(
            x.constructURL("http://www.yandex.com:5674/test/?vow=test", {
                "search": "ololo",
                "test": "ok"
            }),
            "http://www.yandex.com:5674/test/?vow=test&search=ololo&test=ok",
            "OK"
        );

        equal(
            x.constructURL("https://www.mail.ru?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            }),
            "https://www.mail.ru?a=1&areurobot=yes&text=blah#anchor",
            "OK"
        );

        equal(
            //consumer
            x.constructURL("//myhomepage.com?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            }),
            "//myhomepage.com?a=1&areurobot=yes&text=blah#anchor",
            "OK"
        );

        equal(
            //consumer
            x.constructURL("/test/?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            }),
            "/test/?a=1&areurobot=yes&text=blah#anchor",
            "OK"
        );
    });

})();