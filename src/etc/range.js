define([
    "../core"
], function (franky) {
    // Generates loops from range expression
    // E.g. range of callbacks with values from 0 to 999
    // > var res = franky.range('...1000', function (index) {
    // >     console.log(index);
    // > });
    // It's also possible to define from to range
    // E.g. from 10 to 19
    // > var res = franky.range('10...20', function (index) {
    // >     console.log(index);
    // > });
    franky.range = function (/**String*/exp, /**Function*/callback) {
        // three possibilities "...Integer" || "Integer...Integer"
        var parts = exp.split("..."),
            first = 0,
            last = 0;

        if (parts[0] && !isNaN(parts[0])) {
            first = parts[0];
        }

        if (parts[1] && !isNaN(parts[1])) {
            last = parts[1];
        }

        while (first < last) {
            callback(first++);
        }
    };
});