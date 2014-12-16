define([
    '../core',
], function (franky) {
    /**
     * Generates random number 
     * @return {String} random number
     */
    franky.generateId = function () {
        return String(Math.random()).substr(2);
    };
});
