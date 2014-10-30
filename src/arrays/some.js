define([
    '../core'
], function (franky) {
    (function () {
        // array some pollyfill
        var arrSome = Array.prototype.some ?
            function (arr, callback) {
                return arr.some(callback);
            } :
            function (arr, callback) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (callback(arr[i], i, arr)) {
                        return true;
                    }
                }
                return false;
            };

        // Check if at least one item in array matches a truth test.
        franky.some = function (/**Array*/arr, /**Function*/callback) /**Boolean*/ {
            if (!franky.isArray(arr)) {
                franky.error(
                        'first argument is expected to be an array instead of ' + typeof arr
                );
            }

            if (!franky.isFunction(callback)) {
                franky.error(
                        'second argument is expected to be a function instead of ' + typeof callback
                );
            }

            return arrSome(arr, callback);

        };
    }());
});