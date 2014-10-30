define([
    './../core',
    '../arrays/forEach',
    '../checks/isElement'
], function (franky) {
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
});