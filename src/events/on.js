define([
    '../core'
], function( franky ) {
    // Binds function `handler` with `el` element for appropriate `event`
    franky.on = function (/**Element=*/el, /**String*/ event, /**Function*/ handler) {
        if (el.addEventListener) {
            el.addEventListener(event, handler);
        } else if (el.attachEvent) {
            el.attachEvent("on"+event, function (e) {
                e = e || franky.Event;
                if(!e.preventDefault) {
                    e.preventDefault = function () {
                        e.returnValue = false;
                    };
                }
                handler(e);
            });
        }
        return this;
    };
});