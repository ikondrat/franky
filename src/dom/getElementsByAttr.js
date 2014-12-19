define([
    "../core",
    "../etc/console"
], function (franky) {

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
});
