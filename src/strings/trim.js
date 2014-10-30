define([
    '../core'
], function (franky) {
    var trimRe = (new RegExp()).compile(/^\s+|\s+$/g);
    // Replaces empty spaces from start and end of string
    franky.trim = function (/**String*/str) /**String*/ {
        var paramsType = typeof str;
        if (paramsType !== 'string') {
            franky.error('Argument must be string but' + paramsType + ' passed');
        }
        return str.trim instanceof Function ?
            str.trim() :
            str.replace(trimRe, '');
    };
});