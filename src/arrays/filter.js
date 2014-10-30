define([
    '../core',
    '../checks/isArray'
], function (franky) {

    // Use filter pollyfill or existed function
    var arrFilter = Array.prototype.filter ?
        function (arr, callback) {
            return arr.filter(callback);
        } :
        function (arr, callback) {
            var res = [];

            x.each(arr, function (item, i) {
                if (callback(item, i, this)) {
                    res.push(item);
                }
            });

            return res;
        };

    // Select all items that pass a truth test.
    franky.filter = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
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
        return arrFilter(arr, callback);
    };
});