define([
    '../core'
], function (franky) {
    // Array-like structure test E.g.: `arguments` `collection`
    franky.isArrayLike = function (item) {
        return (franky.isObject(item) && !franky.isArray(item) && "length" in item);
    };
});