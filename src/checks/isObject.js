define([
    '../core'
], function (franky) {
    // Object test
    franky.isObject = function (item) /**Boolean*/ {
        return (typeof item === "object");
    };
});