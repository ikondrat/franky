define([
    './../core',
    './console',
    './data'
], function (franky) {
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
});
