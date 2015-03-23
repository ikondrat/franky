define([
    '../core'
], function (franky) {
    // Function test
    franky.isFunction = function () /**Boolean*/ {
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (!(arguments[i] instanceof Function)) {
                return false;
            }
        }
        return true;
    };
});