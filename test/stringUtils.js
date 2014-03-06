/* global x, equal, ok, throws*/
/* jshint multistr: true */
(function() {
    "use strict";

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

})();
