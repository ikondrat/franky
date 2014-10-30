define([
    "./../core",
    "../strings/stringf",
    "../etc/json"
], function( franky ) {

    // Logging utilities
    franky.console = {
        // formated log with pattern
        slog: function (pattern) {
            this.log( franky.stringf.apply(this, arguments) );
        },

        // plain log
        log: function (smth) {
            if (typeof debug !== "undefined") {
                debug(smth);
            } else if (global.console && global.console.log) {
                global.console.log(smth);
            }
        },

        // error report with available stdout
        error: function (txt) {
            throw new Error(txt);
        },

        // detailed log
        dir: function (smth) {
            this.log(franky.JSON.stringify(smth));
        }
    };

    // Log something in console
    franky.log = franky.console.log;

    // Report about error
    franky.error = franky.console.error;
});