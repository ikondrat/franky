define([
    './../core',
    '../checks/isArrayLike'
], function( franky ) {
    // Converts object-like structures to array
    franky.toArray = function (/**Object*/obj) /**Array*/ {
        var res = [];
        if (obj && franky.isArrayLike(obj)) {
            return Array.prototype.slice.call(obj);
        }
        return res;
    };
});