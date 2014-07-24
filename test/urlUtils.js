/* global x, equal, ok, QUnit */
/* jshint multistr: true */
(function() {
    "use strict";

    QUnit.module('franky');

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
    });

})();