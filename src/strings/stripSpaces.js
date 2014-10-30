define([
    '../core'
], function (franky) {
    franky.stripSpaces = function (str) {
        return str.split(" ").join("");
    };
});