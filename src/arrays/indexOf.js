define([
    "../core"
], function (franky) {
    // Dispatch for accessor [Array.indexOf](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
    // Searches index of item in `arr` with declared `value` and from position in array setted  in `startFromIndex`, by default - 0
    franky.indexOf = function (/**Array*/arr, /**String*/value, /**Number=0*/startFromIndex) /**Number*/{
        startFromIndex = startFromIndex || 0;
        if (!(arr instanceof Array)) {
            throw new Error("Function expects array as first argument");
        }
        if ("indexOf" in Array.prototype) {
            return arr.indexOf(value, startFromIndex);
        } else {
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] === value && i >= startFromIndex) {
                    return i;
                }
            }
        }

        return -1;
    };
});