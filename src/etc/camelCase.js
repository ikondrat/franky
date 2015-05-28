define([
    './../core',
], function (franky) {
    var dashes = /-([\da-z])/gi;
    // Converts dashed syntax to [camelCase](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset)
    // >x.camelCase('hello-world') -> 'helloWorld'
    franky.camelCase = function (/**String*/str) /**String*/ {
        return str.replace( dashes, function(all, letter) {
            return letter.toUpperCase();
        });
    };
});
