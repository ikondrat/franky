define([
    '../core'
], function( franky ) {
    var objFacade = {};

    franky.each = objFacade.each = function (/**Object*/obj, /**Function*/callback, /**Object*/contextObj) /**Object*/ {
        if (franky.isArray(obj)) {
            franky.forEach.apply(this, arguments);
        } else {
            var item;
            contextObj = contextObj || obj;

            for (item in obj) {
                if (obj.hasOwnProperty(item)) {
                    callback.call(contextObj, obj[item], item, obj);
                }
            }
        }

        return this;
    };
    return objFacade;
});