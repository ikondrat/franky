define([
    './../core',
    './console'
], function( franky ) {
    // Creates interface description
    var Interface = function (/**String*/name, /**Array*/methods) {
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
    Interface.ensureImplements = function (/**Object*/object, /**Array*/interfaces) /**Boolean*/ {

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

    return Interface;
});