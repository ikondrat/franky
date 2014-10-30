define([
    "./../core"
], function( franky ) {
    // Gets value from object by path
    // > var a = {x: {a: 1}}; x.getJPathValue(a, 'x.1') -> 1
    franky.getJPathValue = function(/**Object*/smth, /**String*/key) {
        var c = smth,
            keys = key.split("."),
            i = 0;

        while(c[keys[i]]) {
            c = c[keys[i++]];
        }

        return c;
    };
});