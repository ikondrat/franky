define([
    './../core',
], function (franky) {
    var camelCases = /([a-z]{1})([A-Z]{1})/g;
    // Converts camelSyntax syntax to dashedSyntax
    // >x.decamelCase('helloWorld') -> 'hello-world'
    franky.decamelCase = function (/**String*/str) /**String*/ {
        return str.replace(camelCases, function(all, letterFirst, letterSecond) {
            return letterFirst + "-" + letterSecond.toLowerCase();
        });
    };
});
