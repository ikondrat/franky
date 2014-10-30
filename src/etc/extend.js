define([
    './../core'
], function (franky) {
    // Extends function by another function
    extend.extend = function (/**Function*/subClass, /**Function*/superClass) {
        var F = function () {};
        subClass.superclass = F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        if(superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    };
});