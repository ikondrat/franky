
define([
    "./../core"
], function( franky ) {
    // Fetches value from object by path
    // > var a = {x: {a: 1}}; x.query.bind(a)('x.1') -> 1
    franky.query = function(/**String*/key) {
        try {
            return (new Function("return this." + key)).call(this);
        } catch (e) {
            return null;
        }
    };
});