define([
    '../core',
    './on'
], function( franky ) {
    var delegatedEvents = {};
    // Event delegation uses [delegation pattern](http://www.princeton.edu/~achaney/tmve/wiki100k/docs/Delegation_pattern.html)
    // and delegates handling of `event` on particular `className` to `body` event handling function
    franky.delegate = function(/**String*/className, /**String*/event, /**Function*/handler) {
        var self = this;
        // Bind event listener only once - if it doesn't exist for this event
        if (!delegatedEvents[event]) {
            delegatedEvents[event] = {};

            franky.on(document.body, event, function (e) {
                var target = e.target || e.srcElement,
                    cln,
                    delegateHandler = function (handler) {
                        handler.call(self, e, target);
                    };
                while(target && target.className) {
                    cln = target.className;

                    if (delegatedEvents[event] && delegatedEvents[event][cln]) {

                        franky.forEach(
                            delegatedEvents[event][cln],
                            delegateHandler
                        );
                    }

                    target = target.parentNode;
                }
            });
        }
        if (!delegatedEvents[event][className]) {
            delegatedEvents[event][className] = [];
        }
        delegatedEvents[event][className].push(handler);
    };
});