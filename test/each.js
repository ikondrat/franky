(function () {
    'use strict';

    test('each', function () {
        var array = [1, 2, 3, 4, 5],
            array2 = [1],
            object = {a: 1, b: 2},
            sum = 0,
            str = '';

        x.each(array, function (item) {
            sum += item;
        });
        equal(sum, 15, 'x.each: Simple each');

        x.each(array2, function () {
            equal(this, undefined, 'x.each: Undefined context');
        });

        sum = 0;
        x.each(array, function (item, index) {
            sum += this[index];
        }, array);
        equal(sum, 15, 'x.each: Context usage');

        sum = 0;
        x.each(object, function (item) {
            sum += item;
        });
        equal(sum, 3, 'x.each: Object usage');

        sum = 0;
        x.each(object, function (item, key) {
            sum += this[key];
            str += key;
        }, object);
        equal(sum, 3, 'x.each: Object usage with context');
        ok(str === 'ab' || str === 'ba', 'x.each: Object usage keys');
    });

    test('forEach', function () {
        equal(x.forEach, x.each, 'x.each: Alias for each');
    });

})();
