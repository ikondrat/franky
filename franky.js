//     Franky.js 1.0.1
//     (c) 2013-2014 Kondrat Shmoylov
//     Franky may be freely distributed under the MIT license.
//     For all details and documentation:
//     github.com/ikondrat/franky

// Define the global object, `window` in the browser, or `exports` on the server.
var xglobal = typeof global !== "undefined" ?
    global : this;

(function (global, name) {
    "use strict";

    // Place defined namespace to global object - by default `x`.
    var ns = global[name] = function (smth) {},
        isDebug = false;

    // Current version
    ns.VERSION = '1.0.1';

    // Base Functions
    // --------------------

    // Define namespace and callback function being fired when namespace reached
    ns.ns = function (/**Object*/self, /**String*/namespace, /**Function*/callbackOnNs) /**Object*/ {

        if (!self[namespace]) {
            self[namespace] = {};
        }

        if (typeof callbackOnNs !== "undefined") {
            callbackOnNs.call(self[namespace]);
        }

        return this;

    };
    var ArrayProto = Array.prototype;
    // Generate random value in range from 0 to specified `count`
    ns.generateId = function (/**Number=*/count) /**Number*/ {
        return parseInt(Math.random() * (count || 1e16));
    };

    // Array test
    ns.isArray = function (item) /**Boolean*/ {
        return (item instanceof Array);
    };

    // Array-like structure test E.g.: `arguments` `collection`
    ns.isArrayLike = function (item) {
        return (ns.isObject(item) && !ns.isArray(item) && "length" in item);
    };

    // Object test
    ns.isObject = function (item) /**Boolean*/ {
        return (typeof item === "object");
    };

    // Object test
    ns.isString = function (item) /**Boolean*/ {
        return (typeof item === "string");
    };

    // Function test
    ns.isFunction = ns.isFunc = function () /**Boolean*/ {
        return ArrayProto.every.call(
            arguments,
            function(x) { return x instanceof Function;}
        );
    };

    // Creates object with `beget` property
    ns.getObject = function (obj) {
        obj.beget = function (values) {
            return x.beget(this, values);
        };
        return x.beget(obj);
    };


    ns.getById = function (id) {
        var contextNode = arguments[1] || global.document || null;

        if (!contextNode.getElementById) {
            throw new Error("getElementById wasn't found");
        }
        return contextNode && contextNode.getElementById(id) || null;
    };

    // Logging utilities
    ns.console = {
        // formated log with pattern
        slog: function (pattern) {
            this.log( ns.stringf.apply(this, arguments) );
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
            this.log(JSON.stringify(smth));
        }
    };

    // Log something in console
    ns.log = ns.console.log;

    // Report about error
    ns.error = ns.console.error;

    // We may fetch all data-* values.
    // For docFragment as `'<div data-var1="hello" data-var2="world"></div>'`
    // >x.datatset(docFragment).var1 -> 'hello'
    // x.datatset(docFragment).var2 -> 'world'
    ns.dataset = function (element) {
        var res = {};
        if (element instanceof Element) {
            if (element.dataset) {
                res = element.dataset
            } else {
                x.each(element.attributes, function (item, key) {
                    if (item.name.indexOf("data-") === 0) {
                        res[item.name.substr(5)] = item.value;
                    }
                });
            }
        }
        return res;
    };

    var getElementsByAttrFallback = function (attr) {
        x.log("fallback");
        var all = document.all,
            res = [];

        for (var i = 0, len = all.length; i < len; ++i) {
            if (typeof all[i].getAttribute(attr) === 'string') {
                res.push(all[i]);
            }
        }

        return res;
    };
    ns.getElementsByAttr = function (attr) {
        var res = [],
            contextNode = arguments[1] || global.document || null;
        if ('getAttribute' in contextNode && contextNode.getAttribute(attr)) {
            res.push(contextNode);
        }
        if (contextNode && contextNode.querySelectorAll) {
            try {
                // safari 5: querySelectorAll returns function-like array
                res = res.concat(ArrayProto.slice.call(contextNode.querySelectorAll('[' + attr + ']')));
            } catch (e) {}
        }
        if (!res.length) {
            res = res.concat(getElementsByAttrFallback(attr));
        }

        return res;
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

    // Native bind is too slow.
    // [See](http://jsperf.com/nativebind-vs-custombind)
    ns.bind = function (func, context) {
        return function () {
            return func.apply(context, arguments);
        };
    };

    // Create object with base object linked as prototype
    ns.beget = function (/**Object*/baseObj, /**Object*/newObjectProperties) /**Object*/{
        var res = {},
            obj,
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

            res = Object.create(baseObj, obj);
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
            res = obj;
        }

        return res;
    };

    // Creates interface description
    ns.Interface = function (/**String*/name, /**Array*/methods) {
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

    // Checks implementation of interface of interfaces for particular object
    ns.Interface.ensureImplements = function (/**Object*/object, /**Array*/interfaces) /**Boolean*/ {

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

        return true;
    };

    // Extends function by another function
    ns.extend = function (/**Function*/subClass, /**Function*/superClass) {
        var F = function () {};
        subClass.superclass = F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        if(superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    };

    // Gets value from object by path
    // > var a = {x: {a: 1}}; x.getJPathValue(a, 'x.1') -> 1
    ns.getJPathValue = function(/**Object*/smth, /**String*/key) {
        var c = smth,
            keys = key.split("."),
            i = 0;

        while(c[keys[i]]) {
            c = c[keys[i++]];
        }

        return c;
    };

    // String Functions
    // --------------------

    // Formats string with pattern as first argument and values as other ones.
    // > var res = ns.stringf('%s %s', 'hello', 'world')
    // > res === 'hello world'
    ns.stringf = function (/**String*/pattern, /**String=*/value) /**String*/ {

        var args = ArrayProto.slice.call(arguments, 1);

        return pattern.replace(/%s/g,
            function(){ return args.shift()||""; });
    };

    (function () {
        var trimRe = (new RegExp()).compile(/^\s+|\s+$/g);

        // Replaces empty spaces from start and end of string
        ns.trim = function (/**String*/str) /**String*/ {
            var paramsType = typeof str;
            if (paramsType !== "string") {
                ns.error("Argument must be string but" + paramsType + " passed");
            }
            return str.trim instanceof Function ?
                str.trim() :
                str.replace(trimRe, "");
        };
    }());


    x.stripSpaces = function (str) {
        return str.split(" ").join("");
    };


    (function () {
        var URLre = /^https?:\/\/\S+/i;

        // check string is URL
        ns.isURL = function (/**String*/str) /**Boolean*/ {
            if (typeof str !== "string") {
                ns.error("isURL expects string parameter instead " + typeof str);
            }

            return URLre.test(str);
        };
    }());

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

    // Array Functions
    // --------------------

    // Return the results of applying the callback to array item.
    ns.map = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
        var res = [];
        if (ns.isArray(arr) && callback instanceof Function) {
            res = arr.map(callback);
        }
        return res;
    };

    (function(){
        // Use filter pollyfill or existed function
        var arrFilter = ArrayProto.filter ?
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

        // Select all items that pass a truth test.
        ns.filter = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
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
    }());

    (function () {
        // array some pollyfill
        var arrSome = ArrayProto.some ?
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

        // Check if at least one item in array matches a truth test.
        ns.some = function (/**Array*/arr, /**Function*/callback) /**Boolean*/ {
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
    }());

    // Collection Functions
    // --------------------

    // Call function on each object item
    ns.eachListItem = function (/**Array*/arr, /**Function*/callback, /**Object*/thisArg) /**Object*/{
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

    // Iterates through every object with callback
    ns.each = ns.forEach = function (/**Object*/smth, /**Function*/callback, /**Object*/thisArg) /**Object*/ {
        var targetFunction = (ns.isArray(smth) || ns.isArrayLike(smth)) ?
            ns.eachListItem : ns.eachProperty;

        targetFunction(smth, callback, thisArg);
        return this;
    };

    if (isDebug) {
        ns.ViewItem = new x.Interface("View", ["getCustomRender", "ruleFunction", "let", "get"]);
    }

    // View Module
    // --------------------

    // base constructor for view
    // > var myViews = x.View();
    // myViews.let('hello', 'hello');
    // It can be based on existed view instance it's optional
    // var uberView = x.View(myViews)
    ns.View = function (/**Object*/view) {
        this.templates = view && view.templates ?
            x.beget(view.templates) :
            {};
    };

    ns.View.prototype = {
        templates: {},

        re: {
            "parse" : /\[\%\s+([^%]+)\s+\%\]/g,
            "rule": /:/
        },

        setParseRe: function (re) {
            this.re.parse = re;
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

        ruleFunction: function (paramName, defaults, superTemplates) {
            return this.getCustomRender(paramName) || function (d) {
                // Get value from `data` or from described `views`
                var res = d && d[paramName] ||
                    (d && d.views && d.views.get(paramName, d)) || "";

                // If result is still empty try to reach other resources
                if (!res) {
                    // first - try to walk through superTemplates
                    res =  superTemplates[paramName] ?
                        self.getContent(superTemplates[paramName], d) :
                        // or get values from described defaults in template declaration
                        defaults ? defaults[paramName] : "";
                }
                if (isDebug && !res) {
                    x.console.log(
                        "Undefined variable " + paramName
                    );
                }
                return res || "";
            };
        },

        // Returns processed string
        getContent: function (/**Array|Object*/tmpl, /**Object*/data) /**String*/{
            return ns.isArray(tmpl) ?
                x.map(tmpl, function (item) {
                    return typeof item === "string" ?
                        item:
                        item(data);
                }).join(""):
                tmpl.toString();
        },

        // Declares template with name
        "let": function (/**String*/name, /**String|Function*/template, /**Object*/defaults) /**Object*/ {

            var result = this.templates[name] = [],
                self = this,
                i = 0;

            template.replace(this.re.parse, function(matchedExpression, matchedKey, matchedIndex) {
                result.push(
                    template.substr(i, matchedIndex - i),
                    self.ruleFunction(matchedKey, defaults, self.templates)
                );
                i = matchedIndex + matchedExpression.length;
            });
            if (i < template.length) {
                result.push(template.substr(i));
            }

            return this;
        },

        // Gets transformed value by defined template and data
        "get": function (/**String*/name, /**Object*/data) /**String*/ {
            var self = this;
            var template = data && data.views ?
                    data.views.templates[name] : this.templates[name];
            return self.getContent(template, data);
        }
    };

    // We have default instanced view for manipulations
    // > x.views.let('say', 'hello {{someone}}')
    // x.views.get('say', {someone: "john"}) -> 'hello john'
    ns.views = new ns.View();

    // Component Module
    // --------------------
    var intComponent = new ns.Interface("intComponent",
        ["init", "data"]
    );

    // Component's base methods
    ns.ComponentBase = {
        // Gets data by key
        data: function (/**String*/name) /**String*/ {
            var el = this.element;
            return el ? ns.data(el, name) : undefined;
        },
        setId: function (id) {
            this.id = id;
            return this;
        },
        baseInit: function (id, element) {
            var self = this;
            this.element = element;
            x.each(ns.dataset(element), function (value, key) {
                self[key] = value;
            })
        }
    };

    ns.Component = (function () {
        var components = [],
            services = [],
            componentsIndex = {},
            appAttr = "data-xapp";

        return {
            // Cornerstone of Component moodule - method for creating new components
            extend: function (componentDescription) {
                var i = components.length,
                    app;

                // Old-school declaration
                // > x.Component.extend({
                //  id: "hello",
                //  init: function () {
                //      console.log("hello");
                //  }
                // });
                if (x.isObject(componentDescription)) {
                    app = x.beget(ns.ComponentBase, componentDescription);
                // Short form declaration
                // > x.Component.extend("hello", function () {
                //      console.log("hello");
                // });
                } else if (x.isString(componentDescription) && x.isFunc(arguments[1])) {
                    app = x.beget(ns.ComponentBase, {
                        id: componentDescription,
                        init: arguments[1]
                    });
                // Dependencies injection form declaration
                // > x.Component.extend('hello', ['$logger', function ($hello) {
                //      $logger.say('hello');
                // }]);
                } else if (x.isString(componentDescription) && x.isArray(arguments[1])) {
                    var args = arguments[1];
                    app = x.beget(ns.ComponentBase, {
                        id: componentDescription,
                        init: function () {
                            var deps = ns.filter(args, function (item) {
                                return x.isString(item);
                            });
                            deps = x.map(deps, function (serviceName) {
                                if (!services[serviceName]) {
                                    throw new Error("Service " + serviceName + " hasn't defined");
                                }
                                return services[serviceName]();
                            });
                            var defs = x.filter(args, function (item) {

                                return ns.isFunction(item);
                            });
                            if (defs.length > 1) {
                                throw new Error("Too much declaration functions");
                            }
                            defs[0].apply(this, deps);
                        }
                    });
                } else {
                    throw new Error('Unknown definition structure, try to use extend("yourName", function() { ... init code ... })');
                }

                ns.Interface.ensureImplements(app, [intComponent]);

                if (!app.id) {
                    ns.error("extend method expects id field in description object");
                }

                components.push(app);
                // fill index
                componentsIndex[app.id] = i;
                return components[i];

            },

            // Declares service with name and function
            // > x.Component.factory("ololo", function () {
            //      var api = {
            //          getOlolo: function () {
            //              return 'ololo';
            //          }
            //      }
            //      return api;
            // });
            factory: function (/**String*/name, /**Function*/factoryFunction) {
                services[name] = factoryFunction;

            },

            // We can init Component module by HTML.
            // E.g. `<div data-xapp='test'></div>`
            // All components must be defined by data-xapp attributes for being inited
            // >E.g. `<div data-xapp='test'></div>`
            // Then x.Component.initByHTML can be called and all assigned components are being called by `init` function
            // `document.addEventListener( "DOMContentLoaded", function () {
            //   x.Component.initByHTML()
            // })`
            "initByHTML": function (/**Element*/context) {
                var contextNode = context || document,
                    self = this,
                    apps = ns.getElementsByAttr(appAttr, contextNode);

                x.each(apps, function (element) {
                    var names = ns.data(element, "xapp");
                    x.each(names.split(" "), function (appName) {
                        self.initById(
                            appName,
                            ns.getElementId(element),
                            element
                        );
                    });
                });

                return this;
            },
            "initById": function (name, elementId, appElement) {
                var app = name in componentsIndex ?
                    components[componentsIndex[name]] : null;

                if (app) {
                    if (typeof elementId !== "undefined") {
                        app.setId(elementId);
                    }
                    app.baseInit(elementId, appElement);
                    app.init(elementId);
                }
            }
        };

    })();
}(xglobal, "x"));
