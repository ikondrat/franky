define([
    "./../core",
    '../objects/bind',
    '../etc/query'
], function( franky ) {
    // Gets value from object by path
    // > var a = {x: {a: 1}}; x.getJPathValue(a, 'x.1') -> 1
    // @deprecated
    franky.getJPathValue = function(/**Object*/smth, /**String*/key) {
        return x.bind(franky.query, smth)(key);
    };
});