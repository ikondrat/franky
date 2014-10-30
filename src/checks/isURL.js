define([
    '../core',
    '../etc/console'
], function (franky) {
    var URLre = /^https?:\/\/\S+/i;

    // check string is URL
    franky.isURL = function (/**String*/str) /**Boolean*/ {
        if (typeof str !== "string") {
            franky.error("isURL expects string parameter instead " + typeof str);
        }

        return URLre.test(str);
    };
});