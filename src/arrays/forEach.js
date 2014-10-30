define([
    "../core"
], function( franky ) {
    // Iterates through every array item with callback
    franky.forEach = function (/**Array*/arr, /**Function*/callback, /**Object*/contextArr) /**Object*/ {
        var i, l;
        contextArr = contextArr || arr;
        for (i = 0, l = arr.length; i < l; i++) {
            callback.call(contextArr, arr[i], i, arr);
        }
        return this;
    };
});