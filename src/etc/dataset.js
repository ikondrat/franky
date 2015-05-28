define([
    './../core',
    '../arrays/forEach',
    './camelCase',
    '../checks/isElement'
], function (franky) {
    // We may fetch all data-* values.
    // For docFragment as `'<div data-var1="hello" data-var2="world"></div>'`
    // >x.datatset(docFragment).var1 -> 'hello'
    // x.datatset(docFragment).var2 -> 'world'
    franky.dataset = function (/**Element*/element) /**Object*/ {
        var res = {};
        if (franky.isElement(element)) {
            if (element.dataset && 'hasOwnProperty' in element.dataset && franky.isFunction(element.dataset.hasOwnProperty)) {
                res = element.dataset;
            } else {
                franky.forEach(element.attributes, function (item) {
                    if (item.name.indexOf("data-") === 0) {
                        res[x.camelCase(item.name.substr(5))] = item.value;
                    }
                });
            }
        }
        return res;
    };
});
