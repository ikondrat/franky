/* global x, QUnit*/
/* jshint multistr: true */
(function(q) {
    "use strict";

    q.module('franky');

    q.test('trim', function() {
        q.equal(
            x.trim(" a  a "),
            "a  a"
            );
    });

    q.test('stripSpaces', function () {
        q.equal(
            x.stripSpaces("blah     blah  blah 11"),
            "blahblahblah11"
        );
        q.equal(
            x.stripSpaces(" blah    blah  "),
            "blahblah"
        );
    });

    q.test('isURL', function () {

        q.ok(
            x.isURL("http://www.yandex.ru/?s=1"),
            "http://www.yandex.ru/?s=1 must be matched as URL"
        );

        q.ok(
            x.isURL("https://www.google.com/path/#aaa"),
            "https://www.google.com/path/#aaa must be matched as URL"
        );

        q.ok(
            !x.isURL("12234"),
            "12234 isn't an URL at all"
        );

        q.ok(
            !x.isURL("//ololo.org"),
            "//ololo.org isn't fully appreciated URL"
        );

        q.throws(
            function () {
                x.isURL({a:1});
            },
            "Only strings parameters are allowed"
        );

        q.throws(
            function () {
                x.isURL(function(){});
            },
            "Only strings parameters are allowed"
        );
    });

    q.test("q.test for x.constructURL", function () {

        q.equal(
            x.constructURL("http://www.yandex.ru", {
                "text": 1,
                "hello": "world"
            }),
            "http://www.yandex.ru?text=1&hello=world",
            "q.ok"
        );

        q.equal(
            x.constructURL("http://www.google.com?", {
                "search": "ololo",
                "q.test": "q.ok"
            }),
            "http://www.google.com?search=ololo&q.test=q.ok",
            "q.ok"
        );

        q.equal(
            x.constructURL("http://www.google.com?", {
                "text": ""
            }),
            "http://www.google.com?text=",
            "q.ok"
        );

        q.equal(
            x.constructURL("http://www.yandex.com/q.test/?vow=q.test", {
                "search": "ololo",
                "q.test": "q.ok"
            }),
            "http://www.yandex.com/q.test/?vow=q.test&search=ololo&q.test=q.ok",
            "q.ok"
        );

        q.equal(
            x.constructURL("http://www.yandex.com:5674/q.test/?vow=q.test", {
                "search": "ololo",
                "q.test": "q.ok"
            }),
            "http://www.yandex.com:5674/q.test/?vow=q.test&search=ololo&q.test=q.ok",
            "q.ok"
        );

        q.equal(
            x.constructURL("https://www.mail.ru?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            }),
            "https://www.mail.ru?a=1&areurobot=yes&text=blah#anchor",
            "q.ok"
        );

        q.equal(
            x.constructURL("//myhomepage.com?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            }),
            "//myhomepage.com?a=1&areurobot=yes&text=blah#anchor",
            "q.ok"
        );

        q.equal(
            x.constructURL("/q.test/?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            }),
            "/q.test/?a=1&areurobot=yes&text=blah#anchor",
            "q.ok"
        );

        q.equal(
            x.constructURL('/q.test/', {
                areurobot: 'yes',
                text: 'blah'
            }),
            '/q.test/?areurobot=yes&text=blah',
            'Constructing with "/q.test/" has failed'
        );

        q.equal(
            x.constructURL('/q.test', {
                areurobot: 'yes',
                text: 'blah'
            }),
            '/q.test?areurobot=yes&text=blah',
            'Constructing with "/q.test" has failed'
        );

    });

}(QUnit));