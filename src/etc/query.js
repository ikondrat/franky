
define([
    "./../core"
], function( franky ) {
    // Fetches value from object by path
    // > var a = {x: {a: 1}}; x.query.bind(a)('x.1') -> 1
    var cache = {};
    franky.query = function(/**String*/key, obj) {
        obj = obj || this;
        if (!cache[key]) {
            cache[key] = new Function('obj', 'return obj.' + key);
        }
        try {
            return cache[key](obj);
        } catch (e) {
            return null;
        }
    };
});