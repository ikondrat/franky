define([
    '../core'
], function (franky) {
    // Function test
    franky.isFunction = function () /**Boolean*/ {
        return Array.prototype.every.call(
            arguments,
            function(x) { return x instanceof Function;}
        );
    };
});