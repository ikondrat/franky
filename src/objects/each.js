define([
    '../core'
], function( franky ) {
    var objFacade = {};
    franky.each = objFacade.each = function (/**Object*/obj, /**Function*/callback, /**Object*/contextObj) /**Object*/ {
        if (franky.isArray(obj)) {
            throw new Error("Each for array is deprecated - use x.forEach");
        }
        var item;
        contextObj = contextObj || obj;

        for (item in obj) {
            if (obj.hasOwnProperty(item)) {
                callback.call(contextObj, obj[item], item, obj);
            }
        }
        return this;
    };
    return objFacade;
});