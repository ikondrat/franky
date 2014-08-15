/* global throws, QUnit, ok, equal, deepEqual */
(function () {
    'use strict';

    QUnit.module('franky');

    test('x.map', function () {
        deepEqual(
            x.map([1,2,3,4,5], function (num) {
                return num + 1;
            }),
            [2,3,4,5,6], 'x.map: expects [2,3,4,5,6]');

        deepEqual(
            x.map([], function (num) {
                return num + 1;
            }),
            [], 'x.map: expects []');

    });

    test('x.filter', function () {
        deepEqual(
            x.filter([1,2,3,4,5,6,8,9,10,11], function (num) {
                return num%2;
            }),
            [1,3,5,9,11], 'x.map: expects [2,4,6,8,10]');

    });

    test('x.some', function () {
        equal(
            x.some([1,2,3,4,5,6,8,9,10,11], function (num) {
                return num%2;
            }),
            true, 'x.map: expects true');

    });

})();
