/* global x, equal, */
/* jshint multistr: true */
(function() {
    "use strict";

    module('Strings');

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

})();