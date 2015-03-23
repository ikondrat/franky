define([
    '../core'
], function (franky) {
    // Object test
    franky.isString = function(){
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (typeof arguments[i] !== "string") {
                return false;
            }
        }
        return true;
    };
});