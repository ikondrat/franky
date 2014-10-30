define([
    '../core'
], function (franky) {
    // Object test
    franky.isString = function (item) /**Boolean*/ {
        return (typeof item === "string");
    };
});