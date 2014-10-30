define([
    './../core',
    '../checks/isElement'
], function (franky) {
    franky.data = function (node, dataName) {
        if (!franky.isElement(node)) {
            franky.error("nodeElement expected as first argument instead of " + typeof node);
        }
        return node.getAttribute("data-" + dataName);
    };
});