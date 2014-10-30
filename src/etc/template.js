define([
    "./../core"
], function( franky ) {
    var reTemplate = /\{\s([^{}]+)\s\}/g;
    // Light template engine implementation with use of functional curring
    // Creates template function for proccess strings
    // @deprecated
    franky.template = function(/**String*/tmpl, /**Object*/defaults){
        var def = defaults || {};

        var func = tmpl.replace(/'/g,"\\'").replace(reTemplate, function (a, b) {
            if (def.hasOwnProperty(b)) {
                return "'+(hash.hasOwnProperty(\"" + b + "\")?hash[\"" + b + "\"]:\"" +
                    def[b] + "\")+'";
            } else {
                return "'+(hash.hasOwnProperty(\"" + b + "\")&&typeof(hash[\"" + b + "\"])!='undefined'?hash[\"" + b + "\"]:'')+'";
            }
        });

        return new Function("hash", "return '" + func + "'"); // jshint ignore:line
    };
});