define([
    '../core',
    '../etc/each',
    './console'
], function (franky) {

    // Create object with base object linked as prototype
    franky.beget = function (/**Object*/baseObj, /**Object*/newObjectProperties) /**Object*/{
        var res = {},
            obj,
            typeBase = typeof baseObj,
            typeProperties = typeof newObjectProperties;

        if (typeBase !== "object") {
            franky.error("Only object allowed to be prototype and tried to work with " + typeBase);
        }
        if (typeProperties !== "undefined" && typeProperties !== "object") {
            franky.error("Only object allowed to be list of properties instead " + typeProperties);
        }
        if (typeof Object.create === "function") {
            obj = {};

            franky.each(newObjectProperties, function (value, key) {
                obj[key]= {writable:true, enumerable: true, "value": value};
            });

            res = Object.create(baseObj, obj);
        } else {
            var F = function () {};

            // check if base Object exists
            if (baseObj && typeof baseObj === "object") {
                F.prototype = baseObj;
            }
            obj = new F();

            if (typeof newObjectProperties !== "undefined") {
                franky.each(newObjectProperties, function (item, i) {
                    obj[i] = item;
                });
            }
            res = obj;
        }

        return res;
    };
});