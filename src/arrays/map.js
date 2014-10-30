define([
    "../core"
], function (franky) {
    // Return the results of applying the callback to array item.
    franky.map = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
        var res = [];
        if (franky.isArray(arr) && callback instanceof Function) {
            res = arr.map(callback);
        }
        return res;
    };
});