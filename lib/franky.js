/*!
 * Franky JavaScript Library v1.0.12
 *
 * (c) 2013-2014 Kondrat Shmoylov
 * Franky may be freely distributed under the MIT license.
 * For all details and documentation:
 * github.com/ikondrat/franky
 *
 * Date: 2015-01-12T15:57Z
 */

(function (global, factory) {

    if (typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(global);
    } else {
        factory(global);
    }

// Pass this if global is not defined yet
}(typeof global !== "undefined" ? global : this, function( global ) {
    var franky = function (smth) {};
    
    franky.version = "1.0.12";
    franky.isDebug = false;

    // Array test
    franky.isArray = function (item) /**Boolean*/ {
        return (item instanceof Array);
    };


    // Array-like structure test E.g.: `arguments` `collection`
    franky.isArrayLike = function (item) {
        return (franky.isObject(item) && !franky.isArray(item) && "length" in item);
    };


    // Checks for element is HTMLElement
    franky.isElement = function (/**Object*/obj) /**Boolean*/ {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
            return obj instanceof HTMLElement;
        }
        catch(e){
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
            return (typeof obj==="object") &&
                (obj.nodeType===1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument ==="object");
        }
    };


    // Function test
    franky.isFunction = function () /**Boolean*/ {
        return Array.prototype.every.call(
            arguments,
            function(x) { return x instanceof Function;}
        );
    };


    // Object test
    franky.isObject = function (item) /**Boolean*/ {
        return (typeof item === "object");
    };


    // Object test
    franky.isString = function(){
        return Array.prototype.every.call(
            arguments,
            function(x) { return typeof x === "string";}
        );
    };


    // Formats string with pattern as first argument and values as other ones.
    // > var res = franky.stringf('%s %s', 'hello', 'world')
    // > res === 'hello world'
    franky.stringf = function (/**String*/pattern, /**String=*/value) /**String*/ {

        var args = Array.prototype.slice.call(arguments, 1);

        return pattern.replace(/%s/g,
            function(){ return args.shift()||""; });
    };


    if (typeof JSON === "undefined") {
        throw new Error("JSON is not supported");
    }
    franky.JSON = JSON;



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


    var URLre = /^https?:\/\/\S+/i;

    // check string is URL
    franky.isURL = function (/**String*/str) /**Boolean*/ {
        if (typeof str !== "string") {
            franky.error("isURL expects string parameter instead " + typeof str);
        }

        return URLre.test(str);
    };



    // Use filter pollyfill or existed function
    var arrFilter = Array.prototype.filter ?
        function (arr, callback) {
            return arr.filter(callback);
        } :
        function (arr, callback) {
            var res = [];

            franky.each(arr, function (item, i) {
                if (callback(item, i, this)) {
                    res.push(item);
                }
            });

            return res;
        };

    // Select all items that pass a truth test.
    franky.filter = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
        if (!franky.isArray(arr)) {
            franky.error(
                    'first argument is expected to be an array instead of ' + typeof arr
            );
        }
        if (!franky.isFunction(callback)) {
            franky.error(
                    'second argument is expected to be a function instead of ' + typeof callback
            );
        }
        return arrFilter(arr, callback);
    };


    // Iterates through every array item with callback
    franky.forEach = function (/**Array*/arr, /**Function*/callback, /**Object*/contextArr) /**Object*/ {
        var i, l;
        contextArr = contextArr || arr;
        for (i = 0, l = arr.length; i < l; i++) {
            callback.call(contextArr, arr[i], i, arr);
        }
        return this;
    };


    // Dispatch for accessor [Array.indexOf](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
    // Searches index of item in `arr` with declared `value` and from position in array setted  in `startFromIndex`, by default - 0
    franky.indexOf = function (/**Array*/arr, /**String*/value, /**Number=0*/startFromIndex) /**Number*/{
        startFromIndex = startFromIndex || 0;
        if (!(arr instanceof Array)) {
            throw new Error("Function expects array as first argument");
        }
        if ("indexOf" in Array.prototype) {
            return arr.indexOf(value, startFromIndex);
        } else {
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] === value && i >= startFromIndex) {
                    return i;
                }
            }
        }

        return -1;
    };


    // Return the results of applying the callback to array item.
    franky.map = function (/**Array*/arr, /**Function*/callback) /**Array*/ {
        var res = [];
        if (franky.isArray(arr) && callback instanceof Function) {
            res = arr.map(callback);
        }
        return res;
    };


    (function () {
        // array some pollyfill
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

        // Check if at least one item in array matches a truth test.
        franky.some = function (/**Array*/arr, /**Function*/callback) /**Boolean*/ {
            if (!franky.isArray(arr)) {
                franky.error(
                        'first argument is expected to be an array instead of ' + typeof arr
                );
            }

            if (!franky.isFunction(callback)) {
                franky.error(
                        'second argument is expected to be a function instead of ' + typeof callback
                );
            }

            return arrSome(arr, callback);

        };
    }());


    var objFacade = {};

    franky.each = objFacade.each = function (/**Object*/obj, /**Function*/callback, /**Object*/contextObj) /**Object*/ {
        if (franky.isArray(obj)) {
            franky.forEach.apply(this, arguments);
        } else {
            var item;
            contextObj = contextObj || obj;

            for (item in obj) {
                if (obj.hasOwnProperty(item)) {
                    callback.call(contextObj, obj[item], item, obj);
                }
            }
        }

        return this;
    };


    // Create object with base object linked as prototype
    franky.beget = function (/**Object*/baseObj, /**Object*/newObjectProperties) /**Object*/{
        var res = {},
            obj,
            typeBase = typeof baseObj,
            typeProperties = typeof newObjectProperties;

        if (typeBase !== "object") {
            franky.error("Only object allowed to be prototype and tried to work with " + typeBase);
        }
        if (typeProperties !== "undefined" && typeProperties !== "object") {
            franky.error("Only object allowed to be list of properties instead " + typeProperties);
        }
        if (typeof Object.create === "function") {
            obj = {};

            franky.each(newObjectProperties, function (value, key) {
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
                franky.each(newObjectProperties, function (item, i) {
                    obj[i] = item;
                });
            }
            res = obj;
        }

        return res;
    };


    // Generate random value in range from 0 to specified `count`
    franky.getRandom = function (/**Number=*/count) /**Number*/ {
        return parseInt(Math.random() * (count || 1000));
    };


    franky.getElementId = function (node) {
        if (!franky.isElement(node)) {
            franky.error('nodeElement expected as first argument instead of ' + typeof node);
        }

        var id = node.getAttribute('id');
        if (!id) {
            id = '_' + franky.getRandom(1e16);
            node.setAttribute('id', id);
        }
        return id;
    };



    var getElementsByAttrFallback = function (attr) {
        var all = document.all,
            res = [];

        for (var i = 0, len = all.length; i < len; ++i) {
            if (typeof all[i].getAttribute(attr) === 'string') {
                res.push(all[i]);
            }
        }

        return res;
    };

    franky.getElementsByAttr = function (attr) {
        var res = [],
            contextNode = arguments[1] || global.document || null;
        if ('getAttribute' in contextNode && contextNode.getAttribute(attr)) {
            res.push(contextNode);
        }
        if (contextNode && contextNode.querySelectorAll) {
            try {
                // safari 5: querySelectorAll returns function-like array
                res = res.concat(Array.prototype.slice.call(contextNode.querySelectorAll('[' + attr + ']')));
            } catch (e) {}
        }
        if (!res.length) {
            res = res.concat(getElementsByAttrFallback(attr));
        }

        return res;
    };


    var trimRe = (new RegExp()).compile(/^\s+|\s+$/g);
    // Replaces empty spaces from start and end of string
    franky.trim = function (/**String*/str) /**String*/ {
        var paramsType = typeof str;
        if (paramsType !== 'string') {
            franky.error('Argument must be string but' + paramsType + ' passed');
        }
        return str.trim instanceof Function ?
            str.trim() :
            str.replace(trimRe, '');
    };


    franky.stripSpaces = function (str) {
        return str.split(" ").join("");
    };


    // Gets value from object by path
    // > var a = {x: {a: 1}}; x.getJPathValue(a, 'x.1') -> 1
    franky.getJPathValue = function(/**Object*/smth, /**String*/key) {
        var c = smth,
            keys = key.split("."),
            i = 0;

        while(c[keys[i]]) {
            c = c[keys[i++]];
        }

        return c;
    };


    // Creates object with `beget` property
    franky.getObject = function (obj) {
        obj.beget = function (values) {
            return franky.beget(this, values);
        };
        return franky.beget(obj);
    };


    franky.create = function (obj) {

        var F = function () {};
        F.prototype = obj;
        return new F();
    };


    /**
     * Appends query parameters to specified URI
     * @param {String} url    URI for append query
     * @param {Object} params Query params by key:value
     *
     * @returns {String} URI with inserted query parameters
     */
    franky.constructURL = function (url, params) {
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



    franky.data = function (node, dataName) {
        if (!franky.isElement(node)) {
            franky.error("nodeElement expected as first argument instead of " + typeof node);
        }
        return node.getAttribute("data-" + dataName);
    };


    // Component Module
    // --------------------
    // Component's base methods
    franky.ComponentBase = {
        // Gets data by key
        data: function (/**String*/name) /**String*/ {
            var el = this.element;
            return el ? franky.data(el, name) : undefined;
        },
        setId: function (id) {
            this.id = id;
            return this;
        },
        baseInit: function (id, element) {
            var self = this;
            this.element = element;
            franky.each(franky.dataset(element), function (value, key) {
                self[key] = value;
            });
        }
    };

    franky.Component = (function () {
        var components = [],
            services = [],
            componentsIndex = {},
            appAttr = 'data-xapp';

        return {
            // Cornerstone of Component moodule - method for creating new components
            extend: function (componentDescription) {
                var i = components.length,
                    app;

                // Old-school declaration
                // > franky.Component.extend({
                //  id: 'hello',
                //  init: function () {
                //      console.log('hello');
                //  }
                // });
                if (franky.isObject(componentDescription)) {
                    app = franky.beget(franky.ComponentBase, componentDescription);
                    // Short form declaration
                    // > franky.Component.extend('hello', function () {
                    //      console.log('hello');
                    // });
                } else if (franky.isString(componentDescription) && franky.isFunction(arguments[1])) {
                    app = franky.beget(franky.ComponentBase, {
                        id: componentDescription,
                        init: arguments[1]
                    });
                    // Dependencies injection form declaration
                    // > franky.Component.extend('hello', ['$logger', function ($hello) {
                    //      $logger.say('hello');
                    // }]);
                } else if (franky.isString(componentDescription) && franky.isArray(arguments[1])) {
                    var args = arguments[1];
                    app = franky.beget(franky.ComponentBase, {
                        id: componentDescription,
                        init: function () {
                            var deps = franky.filter(args, function (item) {
                                return franky.isString(item);
                            });
                            deps = franky.map(deps, function (serviceName) {
                                if (!services[serviceName]) {
                                    throw new Error('Service ' + serviceName + ' hasnt defined');
                                }
                                return services[serviceName]();
                            });
                            var defs = franky.filter(args, function (item) {

                                return franky.isFunction(item);
                            });
                            if (defs.length > 1) {
                                throw new Error('Too much declaration functions');
                            }
                            defs[0].apply(this, deps);
                        }
                    });
                } else {
                    throw new Error('Unknown definition structure, try to use extend("yourName", function() { ... init code ... })');
                }

                if (!app.id) {
                    franky.error('extend method expects id field in description object');
                }

                components.push(app);
                // fill index
                componentsIndex[app.id] = i;
                return components[i];

            },

            // Declares service with name and function
            // > franky.Component.factory('ololo', function () {
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
            // Then franky.Component.initByHTML can be called and all assigned components are being called by `init` function
            // `document.addEventListener( 'DOMContentLoaded', function () {
            //   franky.Component.initByHTML()
            // })`
            'initByHTML': function (/**Element*/context) {
                var contextNode = context || document,
                    self = this,
                    apps = franky.getElementsByAttr(appAttr, contextNode);

                franky.forEach(apps, function (element) {
                    var names = franky.data(element, 'xapp');
                    franky.forEach(names.split(' '), function (appName) {
                        self.initById(
                            appName,
                            franky.getElementId(element),
                            element
                        );
                    });
                });

                return this;
            },
            'initById': function (name, elementId, appElement) {
                var app = name in componentsIndex ?
                    components[componentsIndex[name]] : null;

                if (app) {
                    if (typeof elementId !== 'undefined') {
                        app.setId(elementId);
                    }
                    app.baseInit(elementId, appElement);
                    app.init(elementId);
                }
            }
        };

    })();


    // We may fetch all data-* values.
    // For docFragment as `'<div data-var1="hello" data-var2="world"></div>'`
    // >x.datatset(docFragment).var1 -> 'hello'
    // x.datatset(docFragment).var2 -> 'world'
    franky.dataset = function (/**Element*/element) /**Object*/ {
        var res = {};
        if (franky.isElement(element)) {
            if (element.dataset) {
                res = element.dataset;
            } else {
                franky.forEach(element.attributes, function (item) {
                    if (item.name.indexOf("data-") === 0) {
                        res[item.name.substr(5)] = item.value;
                    }
                });
            }
        }
        return res;
    };


    /**
     * Generates random number 
     * @return {String} random number
     */
    franky.generateId = function () {
        return String(Math.random()).substr(2);
    };


    franky.ns = function (self, namespace, callbackOnNs) {
        if (!self[namespace]) {
            self[namespace] = {};
        }

        if (typeof callbackOnNs !== "undefined") {
            callbackOnNs.call(self[namespace]);
        }

        return this;
    };


    // Extends function by another function
    franky.extend = function (/**Function*/subClass, /**Function*/superClass) {
        var F = function () {};
        subClass.superclass = F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        if(superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    };


    // Creates interface description
    franky.Interface = function (/**String*/name, /**Array*/methods) {
        var self = this;
        if (arguments.length !== 2) {
            franky.error (
                    'Interface constructor called with '+ arguments.length +
                    'parameters, but expected exactly 2');
        }

        this.methods = [];
        this.name = name;

        franky.forEach(methods, function (method) {
            if (typeof method !== 'string') {
                franky.error('Interface constructor expects method '+
                    'names to be passed in as a string');
            }

            self.methods.push(method);
        });
    };

    // Checks implementation of interface of interfaces for particular object
    franky.Interface.ensureImplements = function (/**Object*/object, /**Array*/interfaces) /**Boolean*/ {

        if (arguments.length !== 2) {
            franky.error (
                    'Interface constructor called with '+ arguments.length +
                    'parameters, but expected at least 2');
        }

        franky.forEach(interfaces, function (interfaceItem) {
            if (interfaceItem.constructor !== franky.Interface) {
                franky.error('Function Interface.ensureImplements expects arguments two and above to be instances of Interface.');
            }

            franky.forEach(interfaceItem.methods, function (method) {
                if (!object[method] || typeof object[method] !== 'function') {
                    franky.error('Function Interface.ensureImplements: object '+
                        'does not implement the ' + interfaceItem.name +
                        ' interface. Method ' + method + ' was not found.');
                }
            });
        });

        return true;
    };

    // View Module
    // --------------------

    // base constructor for view
    // > var myViews = franky.View();
    // myViews.let('hello', 'hello');
    // It can be based on existed view instance it's optional
    // var uberView = franky.View(myViews)
    franky.View = function (/**Object*/view) {
        this.templates = view && view.templates ?
            franky.beget(view.templates) :
        {};
    };

    franky.isString = function(){
        return Array.prototype.every.call(
            arguments,
            function(x) { return typeof x === "string";}
        );
    };

    franky.View.prototype = {
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
                    if (franky.isDebug && !d.l10n(key)) {
                        franky.console.error("There is no translation for " + key);
                    }
                    return d.l10n ? d.l10n(key) : key;
                };
            },

            jpath: function(key) {
                return function (d) {
                    return franky.getJPathValue(d, key) || "";
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
            var self = this;
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
                if (franky.isDebug && !res) {
                    franky.console.log(
                            "Undefined variable " + paramName
                    );
                }
                return res || "";
            };
        },

        // Returns processed string
        getContent: function (/**Array|Object*/tmpl, /**Object*/data) /**String*/{
            var res= "";
            // there are thre possible declarations array of functions, string and function
            // array case
            if (franky.isArray(tmpl)) {
                res = franky.map(tmpl, function (item) {
                    return typeof item === "string" ?
                        item:
                        item(data);
                }).join("");
            // function case
            } else if (franky.isFunction(tmpl)) {
                res = tmpl(data);
            // default string case
            } else {
                res = tmpl.toString();
            }

            return res;
        },

        // Gets transformed value by defined template and data
        "get": function (/**String*/name, /**Object*/data) /**String*/ {
            var self = this;
            var template = data && data.views ?
                data.views.templates[name] : this.templates[name];
            return self.getContent(template, data);
        }
    };

    // Declares template with name
    franky.View.prototype.let = function (/**String*/name, /**String|Function*/template, /**Object*/defaults) /**Object*/ {

        var result = this.templates[name] = [],
            self = this,
            i = 0;

        if (franky.isFunction(template)) {
            result.push(template);
        } else {
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
        }


        return this;
    };

    // We have default instanced view for manipulations
    // > franky.views.let('say', 'hello {{someone}}')
    // franky.views.get('say', {someone: "john"}) -> 'hello john'
    franky.views = new franky.View();


    // Converts object-like structures to array
    franky.toArray = function (/**Object*/smth) /**Array*/ {
        return Array.prototype.slice.call(smth);
    };


    // микромодуль для модульного написания кода
    var libs = {},
        cached = {};
    franky.amd = {
        // определяем модуль, по дефолту считаем что будем кешировать порожденную фабрику и по сути делать синглтон
        // e.g. franky.amd.define('myCarFactory', function () { return {serial: 123}; })
        define: function (/**String*/id, /**Function*/lib, /**Boolean*/ runOnce) /**Object*/{
            runOnce = runOnce || true;
            libs[id] = lib;
            if (runOnce) {
                cached[id] = true;
            }
            return this;
        },
        // Обрабатывает зависимости и выполняет callback функцию в случае удовлетворения всех зависимостей
        // e.g. franky.amd.require('myCarFactory', function (carObject) {} );
        require: function () {
            // все аргументы, кроме последнего считаются необходимыми зависимостями
            var depsList = franky.toArray(arguments).slice(0, arguments.length - 1),
            // последний аргумент - функция в которую уйдут удовлетворенные зависимости
                callback = arguments[arguments.length - 1];
            // обработка зависимостей
            depsList = franky.map(depsList, function (depsItem) {
                if (!libs[depsItem]) {
                    throw new Error('Unmet dependency:' + depsItem);
                }
                // если модуль представляет из себя синглтон - кешируем его
                if (cached[depsItem]) {
                    libs[depsItem] = franky.isFunction(libs[depsItem]) ? libs[depsItem]() : libs[depsItem];
                    return libs[depsItem];
                } else {
                    return libs[depsItem]();
                }
            });

            // пробрасываем удовлетворенные зависимости
            callback.apply(this, depsList);

            return this;
        }
    };


    // Возвращает "обесшумленную функцию". Функция будет вызвана после последнего вызова через объявленный таймаут.
    // Если задан флаг `immediate`, функция вызовется немедленно, но будет игнорировать вызовы в пределах таймаута.
    franky.debounce = function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };


    // Register as a named AMD module
    if ( typeof define === "function" && define.amd ) {
        define( "franky", [], function() {
            return franky;
        });
    }
    global.x = global.franky = franky;


    return franky;

}));