var xglobal = typeof global !== "undefined" ? global : this;

(function (global, name) {
    "use strict";

    var ns = global[name] = function (smth) {},
        isDebug = true;

    ns.ns = function (self, namespace, callbackOnNs) {

        if (!self[namespace]) {
            self[namespace] = {};
        }

        if (typeof callbackOnNs !== "undefined") {
            callbackOnNs.call(self[namespace]);
        }

        return this;
    };

    ns.getEmptyString = function () {return "";};

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

    ns.map = function (arr, callback) {
        if (arr instanceof Array && callback instanceof Function) {

            return arr.map(callback);

        }
    };

    /**
     * Iterates object or array with callback
     * @param  {Object}            array or object for iterate
     * @param  {Function}          callback fired on each item
     * @return {Object}            context object
     */
    ns.forEach = function (smth, callback) {
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
    };

    ns.trimRe = (new RegExp()).compile(/^\s+|\s+$/g);
    ns.trim = function (str) {
        str = str || null;
        if (str) {
            return str.trim instanceof Function ?
                str.trim() :
                str.replace(ns.trimRe, "");
        }
        
    };

    x.stripSpaces = function (str) {
        return str.split(" ").join("");
    };

    // alias
    ns.each =  function () {
        return this.forEach.apply(this, arguments);
    };

    ns.isFunc = function() {
        return Array.prototype.every.call(
            arguments,
            function(x) { return x instanceof Function;}
        );
    };

    // нативный bind очень медленный в chrome браузерах
    // http://jsperf.com/nativebind-vs-custombind
    ns.bind = function (func, context) {
        return function () {
            return func.apply(context, arguments);
        };
    };

    ns.beget = function (baseObj, valuesForNewObject) {
        var obj = {};

        if (Object.create) {

            x.each(valuesForNewObject, function (value, key) {
                obj[key]= {writable:true, enumerable: true, "value": value};
            });

            return Object.create(baseObj, obj);
        }

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

        error: function (txt) {
            throw new Error(txt);
        },

        dir: function (smth) {
            this.log(JSON.stringify(smth));
        }
    };

    ns.Interface = function (name, methods) {
        var self = this;
        if (arguments.length !== 2) {
            throw new Error (
                "Interface constructor called with "+ arguments.length +
                "parameters, but expected exactly 2");
        }

        this.methods = [];
        this.name = name;

        x.each(methods, function (method) {
            if (typeof method !== "string") {
                throw new Error("Interface constructor expects method "+
                    "names to be passed in as a string");
            }

            self.methods.push(method);
        });
    };

    ns.Interface.ensureImplements = function (object) {

        if (arguments.length !== 2) {
            throw new Error (
                "Interface constructor called with "+ arguments.length +
                "parameters, but expected at least 2");
        }

        x.each(Array.prototype.slice.call(arguments, 1), function (interfaceItem) {
            if (interfaceItem.constructor !== ns.Interface) {
                throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface.");
            }

            x.each(interfaceItem.methods, function (method) {
                if (!object[method] || typeof object[method] !== "function") {
                    throw new Error("Function Interface.ensureImplements: object "+
                        "does not implement the " + interfaceItem.name +
                        " interface. Method " + method + " was not found.");
                }
            });
        });
    };

    ns.extend = function (subClass, superClass) {
        var F = function () {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = superClass;
    };

    ns.getJPathValue = function(smth, key) {
        var c = smth,
            keys = key.split("."),
            i = 0;

        while(c[keys[i]]) {
            c = c[keys[i++]];
        }

        return c;
    };

    ns.create = function (obj) {

        var F = function () {};
        F.prototype = obj;
        var res = new F();
        return res;
    };

    if (isDebug) {
        ns.ViewItem = new x.Interface("View", ["getCustomRender", "ruleFunction", "let", "get"]);
    }
    

    ns.View = function (view) {
        this.templates = view && view.templates ?
            x.beget(view.templates) :
            {};
    };

    ns.View.prototype = {
        templates: {},

        re: {
            "parse" : /\[%\s([^%]+)\s%\]/g,
            "rule": /\s*:\s*/
        },

        getCustomRender: function () {
            var def = arguments[0] !== "undefined" ?
                arguments[0].split(this.re.rule) :
                null;

            if (def && def.length === 2) {
                return this.parseRules[def[0]] && this.parseRules[def[0]].call(this, def[1]);
            }
        },

        parseRules: {
            l10n: function(key){
                return function (d) {
                    if (isDebug && !d.l10n(key)) {
                        ns.console.error("There is no translation for " + key);
                    }
                    return d.l10n ? d.l10n(key) : key;
                };
            },

            jpath: function(key) {
                return function (d) {
                    var res = "";

                    res = x.getJPathValue(d, key) || "";

                    return res;
                };
            },

            view: function(key) {
                var self = this;

                return function (d) {
                    return self.get(key, d);
                };
            }
        },

        ruleFunction: function (paramName, defaults) {
            var res = this.getCustomRender(paramName) || function (d) {

                var res = d[paramName] || defaults[paramName];

                if (isDebug && !res) {
                    x.console.log(
                        "Undefined variable" + paramName
                    );
                }
                return res || "";
            };

            return res;
        },

        "let": function (name, template, defaults) {

            var inTemplates = name in this.templates;
            
            
            var result = [],
                superTmpl = name in this.templates ? this.templates[name] : null,
                self = this,
                i = 0;

            result = this.templates[name] = superTmpl ? x.create(superTmpl) : [];
            if (inTemplates) {
                result._super = superTmpl;
            }
            template.replace(this.re.parse, function(matchedExpression, matchedKey, matchedIndex) {
                result.push(
                    template.substr(i, matchedIndex - i),
                    self.ruleFunction(matchedKey, defaults)
                );
                i = matchedIndex + matchedExpression.length;

            });
            if (i < template.length) {
                result.push(template.substr(i));
            }

            return this;
        },
        "get": function (name, data) {
            var template = this.templates[name],
                res = template instanceof Array ?
                    x.map(template, function (item) {
                        return typeof item === "string" ?
                            item:
                            item(data);
                    }).join(""):
                    template;
            return res;
        }
    };

    ns.views = new ns.View();
    ns.getObject = function (obj) {
        obj.beget = function (values) {
            return x.beget(this, values);
        };

        return x.beget(obj);
    };

}(xglobal, "x"));
