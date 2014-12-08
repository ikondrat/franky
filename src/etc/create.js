define([
    './../core'
], function (franky) {
    franky.create = function (obj) {

        var F = function () {};
        F.prototype = obj;
        return new F();
    };
});