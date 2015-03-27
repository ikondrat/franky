
define([
    "./../core"
], function( franky ) {
    // http://jsperf.com/query-by-path
    // Fetches value from object by path
    // > var a = {x: {a: 1}}; x.query.bind(a)('x.1') -> 1
    var cache = {};
    franky.query = function(key, obj) {
        var c = obj || this || {},
            keys = key.split("."),
            i = 0;

        while (c[keys[i]]) {
            c = c[keys[i++]];
        }
        return (i === keys.length) ? c : null;
    };
});