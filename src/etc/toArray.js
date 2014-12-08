define([
    './../core',
    '../checks/isArrayLike'
], function( franky ) {
    // Converts object-like structures to array
    franky.toArray = function (/**Object*/smth) /**Array*/ {
        return Array.prototype.slice.call(smth);
    };
});