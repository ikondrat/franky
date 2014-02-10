(function (global, name) {
    "use strict";

    var frankyFunction = function (smth) {
        if (typeof smth !== "undefined") {
            this.smth = smth;
        }
    };

    frankyFunction.prototype = {
        forEach: function (callback) {
            var smth = this.smth;

            if (smth instanceof Array) {
                for (var i = 0, l = smth.length; i < l; i++) {
                    callback(smth[i], i, smth);
                }
            } else {
                for (var item in smth) {
                    if (smth.hasOwnProperty(item)) {
                        callback(smth[item], item, smth);
                    }
                }
            }

            return this;
        },

        "map": function (callback) {
            var smth = this.smth;
            // FIXME: Сделать деградацию при отсутствии map
            if (smth instanceof Array) {

                return smth.map(callback);

            }
            
        },

        beget: function (valuesForNewObject) {
            var F = function () {},
                obj;

            // check if base Object exists
            if (this.smth && typeof this.smth === "object") {
                F.prototype = this.smth;
            }
            obj = new F();

            if (typeof valuesForNewObject !== "undefined") {
                x(valuesForNewObject).forEach(function (item, i) {
                    obj[i] = item;
                });
            }
            
            return obj;
        },

        ns: function (namespace, callbackOnNs) {
            var self = this.smth;

            if (!self[namespace]) {
                self[namespace] = {};
            }

            if (typeof callbackOnNs !== "undefined") {
                callbackOnNs.call(self[namespace]);
            }

            return this;
        },

        trim: function () {
            var str = (typeof this.smth === "string") ?
                this.smth : null;

            if (str) {
                return str.trim instanceof Function ?
                    str.trim() :
                    str.replace(/^\s+|\s+$/g, "");
            }
            
        }
    };

    var ns = global[name] = function (smth) {
        return new frankyFunction(smth);
    };


    /**
     * Formats string with pattern as first argument and values as other ones.
     * E.g.: ns.stringf("%s %s", "hello", "world") -> "hello world"
     * @return {String} formated string
     */
    ns.stringf = function () {

        var pattern = arguments[0],
            args = Array.prototype.slice.call(arguments, 1);

        return pattern.replace(/%s/g,
            function(){ return args.shift()||""; });

    };

    /**
     * Generates random number 
     * @return {String} random number
     */
    ns.generateId = function () {
        return String(Math.random()).substr(2, 12);
    };

    ns.console = {
        slog: function (pattern) {
            this.log( ns.stringf.apply(this, arguments) );
        },

        log: function () {
            if (typeof debug !== "undefined") {
                x(arguments).forEach(function (smth) {
                    debug(smth);
                });
            }
        },

        dir: function (smth) {
            this.log(JSON.stringify(smth));
        }
    };

}(this, "x"));