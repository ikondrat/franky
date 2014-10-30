define([
    '../core'
], function( franky ) {
    // Native bind is too slow.
    // [See](http://jsperf.com/nativebind-vs-custombind)
    franky.bind = function (func, context) {
        return function () {
            return func.apply(context, arguments);
        };
    };
});