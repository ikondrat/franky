define([
    './../core',
    '../arrays/indexOf'
], function (franky) {
    /**
     * Set datastructure
     * @constructor
     */
    franky.Set = function () {
        this.items = [];
    };

    franky.Set.prototype = {
        /**
         * Adds unique value
         * @param value
         */
        add: function (value) {
            if (!this.has(value)) {
                this.items.push(value);
            }
            return this;
        },
        /**
         * Checks for existing value in Set
         * @param value
         * @returns {boolean}
         */
        has: function (value) {
            return x.indexOf(this.items, value) !== -1;
        },
        /**
         * Removes value from Set
         * @param value
         * @returns <Item>
         */
        remove: function (value) {
            var res;
            if (this.has(value)) {
                res = this.items.splice(
                    x.indexOf(this.items, value),
                    1
                );
            }
            return res;
        },
        /**
         * Removes first value and returns it as value
         */
        removeFirst: function () {
            var res;
            if (!this.isEmpty()) {
                res = this.items.splice(0,1);
            }
            return res;
        },

        /**
         * Iterates through values and void callback
         * @param callback
         */
        iterate: function (callback) {
            for (var i = 0, l = this.items.length; i < l; i++) {
                callback(this.items[i], i, this.items);
            }
            return this;
        },

        /**
         * Returns size of Set
         * @returns {Integer}
         */
        size: function () {
            return this.items.length;
        },

        /**
         * Checks Set for empty state
         * @returns {boolean}
         */
        isEmpty: function () {
            return this.items.length === 0;
        }
    };
});



