define([
    "../core"
], function (franky) {
    franky.range = function (exp, callback) {
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