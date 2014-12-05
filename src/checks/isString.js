define([
    '../core'
], function (franky) {
    // Object test
    franky.isString = function(){
        return Array.prototype.every.call(
            arguments,
            function(x) { return typeof x === "string";}
        );
    };
});