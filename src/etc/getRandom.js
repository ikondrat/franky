define([
    '../core',
    './beget'
], function (franky) {
    // Generate random value in range from 0 to specified `count`
    franky.getRandom = function (/**Number=*/count) /**Number*/ {
        return parseInt(Math.random() * (count || 1000));
    };
});