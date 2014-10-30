define([
    '../core',
    './beget'
], function (franky) {
    // Creates object with `beget` property
    franky.getObject = function (obj) {
        obj.beget = function (values) {
            return franky.beget(this, values);
        };
        return franky.beget(obj);
    };
});