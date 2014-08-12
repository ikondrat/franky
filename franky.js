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
        return String(Math.random()).substr(2);
    };

    ns.map = function (arr, callback) {
        if (ns.isArray(arr) && callback instanceof Function) {
            return arr.map(callback);
        }
    };


    ns.console = {
        slog: function (pattern) {
            this.log( ns.stringf.apply(this, arguments) );
        },

        log: function (smth) {
            if (typeof debug !== "undefined") {
                debug(smth);
            } else if (global.console && global.console.log) {
                global.console.log(smth);
            }
        },

        error: function (txt) {
            throw new Error(txt);
        },

        dir: function (smth) {
            this.log(JSON.stringify(smth));
        }
    };
    ns.log = ns.console.log;
    ns.error = ns.console.error;

    var arrFilter = Array.prototype.filter ?
        function (arr, callback) {
            return arr.filter(callback);
        } :
        function (arr, callback) {
            var res = [];

            x.each(arr, function (item, i) {
                if (callback(item, i, this)) {
                    res.push(item);
                }
            });

            return res;
        };

    ns.filter = function (arr, callback) {
        if (!ns.isArray(arr)) {
            ns.error(
                "first argument is expected to be an array instead of " + typeof arr
            );
        }
        if (!ns.isFunc(callback)) {
            ns.error(
                "second argument is expected to be a function instead of " + typeof callback
            );
        }
        return arrFilter(arr, callback);
    };

    var arrSome = Array.prototype.some ?
        function (arr, callback) {
            return arr.some(callback);
        } :
        function (arr, callback) {
            for (var i = 0, l = arr.length; i < l; i++) {
                if (callback(arr[i], i, arr)) {
                    return true;
                }
            }
            return false;
        };

    ns.some = function (arr, callback) {
        if (!ns.isArray(arr)) {
            ns.error(
                "first argument is expected to be an array instead of " + typeof arr
            );
        }

        if (!ns.isFunc(callback)) {
            ns.error(
                "second argument is expected to be a function instead of " + typeof callback
            );
        }

        return arrSome(arr, callback);

    };

    ns.isArray = function (item) {
        return (item instanceof Array);
    };

    ns.isArrayLike = function (item) {
        return (ns.isObject(item) && !ns.isArray(item) && "length" in item);
    };

    ns.isObject = function (item) {
        return (typeof item === "object");
    };

    ns.eachListItem = function (arr, callback, thisArg) {
        var i, l;

        if (thisArg) {
            for (i = 0, l = arr.length; i < l; i++) {
                callback.call(thisArg, arr[i], i, arr);
            }
        } else {
            for (i = 0, l = arr.length; i < l; i++) {
                callback(arr[i], i, arr);
            }
        }
        return this;
    };

    ns.eachProperty = function (obj, callback, thisArg) {
        var item;

        if (thisArg) {
            for (item in obj) {
                if (obj.hasOwnProperty(item)) {
                    callback.call(thisArg, obj[item], item, obj);
                }
            }
        } else {
            for (item in obj) {
                if (obj.hasOwnProperty(item)) {
                    callback(obj[item], item, obj);
                }
            }
        }
        return this;
    };

    ns.trimRe = (new RegExp()).compile(/^\s+|\s+$/g);
    ns.trim = function (str) {
        var paramsType = typeof str;
        if (paramsType !== "string") {
            ns.error("Argument must be string but" + paramsType + " passed");
        }
        return str.trim instanceof Function ?
            str.trim() :
            str.replace(ns.trimRe, "");
    };

    x.stripSpaces = function (str) {
        return str.split(" ").join("");
    };

    /**
     * Iterates object or array with callback
     * @param  {Object}            array or object for iterate
     * @param  {Function}          callback fired on each item
     * @param  {Object}            [thisArg=undefined] context for the callback
     * @returns {Object}           context object
     */
    ns.each = ns.forEach = function (smth, callback, thisArg) {
        var targetFunction = (ns.isArray(smth) || ns.isArrayLike(smth)) ?
            ns.eachListItem : ns.eachProperty;

        targetFunction(smth, callback, thisArg);
        return this;
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

    ns.beget = function (baseObj, newObjectProperties) {
        var obj,
            typeBase = typeof baseObj,
            typeProperties = typeof newObjectProperties;

        if (typeBase !== "object") {
            ns.error("Only object allowed to be prototype and tried to work with " + typeBase);
        }
        if (typeProperties !== "undefined" && typeProperties !== "object") {
            ns.error("Only object allowed to be list of properties instead " + typeProperties);
        }
        if (typeof Object.create === "function") {
            obj = {};

            x.each(newObjectProperties, function (value, key) {
                obj[key]= {writable:true, enumerable: true, "value": value};
            });

            return Object.create(baseObj, obj);
        } else {
            var F = function () {};

            // check if base Object exists
            if (baseObj && typeof baseObj === "object") {
                F.prototype = baseObj;
            }
            obj = new F();

            if (typeof newObjectProperties !== "undefined") {
                x.each(newObjectProperties, function (item, i) {
                    obj[i] = item;
                });
            }
            return obj;
        }
    };

    /**
     * Creates interface description
     * @param {string} name Name of interface
     * @param {array} methods List of methods descibed as strings
     * @constructor
     */
    ns.Interface = function (name, methods) {
        var self = this;
        if (arguments.length !== 2) {
            ns.error (
                "Interface constructor called with "+ arguments.length +
                "parameters, but expected exactly 2");
        }

        this.methods = [];
        this.name = name;

        x.each(methods, function (method) {
            if (typeof method !== "string") {
                ns.error("Interface constructor expects method "+
                    "names to be passed in as a string");
            }

            self.methods.push(method);
        });
    };

    /**
     * Checks implementation of interface of interfaces for particular object
     * @param {object} object    Object for check implementation
     * @param {array} interfaces    Array of interfaces for check
     * @returns {boolean}
     */
    ns.Interface.ensureImplements = function (object, interfaces) {

        if (arguments.length !== 2) {
            ns.error (
                "Interface constructor called with "+ arguments.length +
                "parameters, but expected at least 2");
        }

        x.each(interfaces, function (interfaceItem) {
            if (interfaceItem.constructor !== ns.Interface) {
                ns.error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface.");
            }

            x.each(interfaceItem.methods, function (method) {
                if (!object[method] || typeof object[method] !== "function") {
                    ns.error("Function Interface.ensureImplements: object "+
                        "does not implement the " + interfaceItem.name +
                        " interface. Method " + method + " was not found.");
                }
            });
        });
    };

    /**
     * Extends function by another function
     * @param {function} subClass   Function for extend
     * @param {function} superClass Function is used as superClass
     */
    ns.extend = function (subClass, superClass) {
        var F = function () {};
        subClass.superclass = F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        if(superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
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
        return new F();
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
            "parse" : /{{\s+([^}]+)\s+}}/g,
            "rule": /:/
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
                    return x.getJPathValue(d, key) || "";
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
            return this.getCustomRender(paramName) || function (d) {

                var res = d[paramName] || defaults[paramName];

                if (isDebug && !res) {
                    x.console.log(
                        "Undefined variable" + paramName
                    );
                }
                return res || "";
            };
        },

        "let": function (name, template, defaults) {

            var inTemplates = name in this.templates;


            var result = [],
                superTmpl = name in this.templates ? this.templates[name] : null,
                self = this,
                i = 0;

            result = this.templates[name] = [];
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
            var template = data && data.views ? data.views.templates[name] : this.templates[name],
                res = ns.isArray(template) ?
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

    ns.URLre = /^https?:\/\/\S+/i;

    ns.isURL = function (str) {
        if (typeof str !== "string") {
            ns.error("isURL expects string parameter instead " + typeof str);
        }

        return ns.URLre.test(str);
    };

    var intComponent = new ns.Interface("intComponent",
        ["init", "data"]
    );

    ns.ComponentBase = {
        data: function (name) {
            var el = this.getNodeElement();

            return el ? ns.data(el, name) : undefined;
        },
        getNodeElement: function () {
            var x1 = ns.byId(this.id);
            return x1.length ? x1[0] : x1;
        },
        setId: function (id) {
            this.id = id;
        }
    };

    ns.Component = (function () {
        var components = [],
            componentsIndex = {},
            appAttr = "data-xapp";
        return {
            extend: function (componentDescription) {
                var i = components.length,
                    app = x.beget(ns.ComponentBase, componentDescription);

                ns.Interface.ensureImplements(app, [intComponent]);

                if (!app.id) {
                    ns.error("extend method expects id field in description object");
                }

                components.push(app);
                // fill index
                componentsIndex[app.id] = i;
                return components[i];
            },

            // инициализация по структуре html
            "initByHTML": function (context) {
                var contextNode = context || document,
                    self = this,
                    apps = ns.byAttr(appAttr, contextNode);

                x.each(apps, function (element) {
                    var names = ns.data(element, "xapp");
                    x.each(names.split(" "), function (appName) {
                        self.initById(appName,
                            ns.getElementId(element)
                        );
                    });
                });
            },

            "initById": function (name, elementId) {
                var app = name in componentsIndex ?
                        components[componentsIndex[name]] : null;

                if (app) {
                    if (typeof elementId !== "undefined") {
                        app.setId(elementId);
                    }
                    app.init(elementId);
                }
            }
        };

    })();

    var byAttrFallback = function (attr) {
        var all = document.all,
            res = [];

        for (var i = 0, len = all.length; i < len; ++i) {
            if (typeof all[i].getAttribute(attr) === 'string') {
                res.push(all[i]);
            }
        }

        return res;
    };
    ns.byAttr = function (attr) {
        var contextNode = arguments[1] || global.document || null;

        if (contextNode && contextNode.querySelectorAll) {
            try {
                // safari 5: querySelectorAll returns function-like array
                return Array.prototype.slice.call(contextNode.querySelectorAll('[' + attr + ']'));
            } catch (e) {}
        }

        return byAttrFallback(attr);
    };

    ns.byId = function (id) {
        var contextNode = arguments[1] || global.document || null;

        return contextNode && contextNode.getElementById(id) || null;
    };

    var ELEMENT_NODE = 1;
    var elementCheck = function (node) {
        return node && node.nodeType === ELEMENT_NODE;
    };
    ns.data = function (node, dataName) {
        if (!elementCheck(node)) {
            ns.error("nodeElement expected as first argument instead of " + typeof node);
        }
        return node.getAttribute("data-" + dataName);
    };

    ns.getElementId = function (node) {
        if (!elementCheck(node)) {
            ns.error("nodeElement expected as first argument instead of " + typeof node);
        }

        var id = node.getAttribute("id");
        if (!id) {
            id = "_" + ns.generateId();
            node.setAttribute("id", id);
        }

        return id;
    };

    /**
    * Appends query parameters to specified URI
    * @param {String} url    URI for append query
    * @param {Object} params Query params by key:value
    *
    * @returns {String} URI with inserted query parameters
    */
    ns.constructURL = function (url, params) {
        var res = "",
            query = [],
            item,
            items = url.match(/((?:https?\:)?(?:\/)?\/[^?]+)\?([^#]+)?(\#\S+)?/),
            hashValue = items && items[3] ? items[3] : "";

        if (items && items[2]) {
            var cquery = items[2].split("&"),
            i = cquery.length;

            while (i--) {
                query.push(cquery[i]);
            }
        }
        for (item in params) {
            if (params.hasOwnProperty(item)) {
                query.push(item + "=" + params[item]);
            }
        }

        if (items) {

            res = items[1] + "?" + query.join("&") + hashValue;
        } else {
            res = url + "?" + query.join("&") + hashValue;
        }

        return res;
    };

}(xglobal, "x"));
