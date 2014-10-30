define([
    '../core',
    '../etc/console',
    '../etc/getRandom'
], function (franky) {
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
});