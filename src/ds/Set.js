define([
    './../core'
], function (franky) {
    franky.Set = function () {
        this.items = [];
    };

    franky.Set.prototype = {
        add: function (value) {
            if (!this.has(value)) {
                this.items.push(value);
            }
        },
        has: function (value) {
            return this.items.indexOf(value) !== -1;
        },
        remove: function (value) {
            if (this.has(value)) {
                this.items.splice(
                    this.items.indexOf(value),
                    1
                );
            }
        },

        removeFirst: function () {
            if (!this.isEmpty()) {
                this.items.splice(0,1);
            }
        },

        iterate: function (callback) {
            for (var i = 0, l = this.items.length; i < l; i++) {
                callback(this.items[i], i, this.items);
            }
        },

        size: function () {
            return this.items.length;
        },

        isEmpty: function () {
            return this.items.length === 0;
        }
    };
});



