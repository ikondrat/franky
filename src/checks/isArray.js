define([
    '../core'
], function (franky) {
    // Array test
    franky.isArray = function (item) /**Boolean*/ {
        return (item instanceof Array);
    };
});