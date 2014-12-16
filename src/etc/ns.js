define([
    '../core',
], function (franky) {
    franky.ns = function (self, namespace, callbackOnNs) {
        if (!self[namespace]) {
            self[namespace] = {};
        }

        if (typeof callbackOnNs !== "undefined") {
            callbackOnNs.call(self[namespace]);
        }

        return this;
    };
});
