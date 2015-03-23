define([
    "../core"
], function (franky) {
    // Return the results of applying the callback to array item.
    franky.map = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
        var res = [];
        if (franky.isArray(arr) && callback instanceof Function) {

            if (x.isFunction(arr.map)) {
                res = arr.map(callback);
            } else {
                for(var j = 0, l = arr.length; i < l; i++) {
                    res[j] = callback(arr[j], j,  arr);
                }
            }

        }
        return res;
    };
});