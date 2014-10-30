define([
    "./../core"
], function( franky ) {
    // Formats string with pattern as first argument and values as other ones.
    // > var res = franky.stringf('%s %s', 'hello', 'world')
    // > res === 'hello world'
    franky.stringf = function (/**String*/pattern, /**String=*/value) /**String*/ {

        var args = Array.prototype.slice.call(arguments, 1);

        return pattern.replace(/%s/g,
            function(){ return args.shift()||""; });
    };
});