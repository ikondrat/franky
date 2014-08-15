/* global x, QUnit */
/* jshint multistr: true */
(function(q) {
    "use strict";

    q.module('franky');

    test('x.dataset', function() {
        var el = document.createElement('div'),
            testData = "";

        el.setAttribute("data-var1", "hello");
        el.setAttribute("data-var2", "world");
        el.setAttribute("data-var3", "againt");

        var data = x.dataset(el);
        equal(
            data.var1,
            "hello"
        );
        equal(
            data.var1 + " " + data.var2,
            "hello world"
        );
        equal(
            data.someUndefined,
            undefined
        );
    });

    var arr = [2,3,4],
        arrLike = {},
        obj = {
            x: 1,
            y: 2
        };
    Array.prototype.push.call(arrLike, 1);

    test('isArray', function() {
        ok(
            x.isArray(arr),
            "isArray with array argument must return true"
        );
        ok(
            !x.isArray(arrLike),
            "isArray with arrayLike argument must return false"
        );
        ok(
            !x.isArray(obj),
            "isArray with object argument must return false"
        );
        ok(
            x.isArrayLike(arrLike),
            "isArrayLike with arrayLike argument must return true"
        );
        ok(
            !x.isArrayLike(obj),
            "isArrayLike with arrayLike argument must return false"
        );
        ok(
            !x.isArrayLike(arr),
            "isArrayLike with array argument must return false"
        );
    });

    test('isFunc', function () {
        ok(
            x.isFunc(function(){}),
            'isFunc single argument usage'
        );
        ok(
            !x.isFunc({}),
            'isFunc not a func'
        );
        ok(
            !x.isFunc(true),
            'isFunc not a func 2'
        );
        ok(
            x.isFunc(Function.prototype.call, String.prototype.indexOf),
            'isFunc multiple argument usage'
        );
    });

    test('beget', function () {

        var baseObject = {
                variable: 1,
                str: "hello",
                obj: {
                    "test": 1
                }
            },
            customObject = x.getObject(baseObject),
            begetObject = customObject.beget({
                "ololo": 1
            }),
            begetObjectX = begetObject.beget({
                "ololo": 2
            });

        ok(customObject.variable === 1 &&
            customObject.str === "hello" &&
            customObject.obj.test === 1,
            "Object's variables should be available for access");

        ok(
            !customObject.hasOwnProperty("variable"),
            "Should be acceses as prototypes"
        );

        equal(
            begetObjectX.ololo,
            2,
            "ololo should be property of object"
        );
        equal(
            begetObject.ololo,
            1,
            "ololo should be property of object"
        );
    });

    test('beget-enumerable', function () {
        var base = {
                property: 1
            },
            extended = x.beget(base, {
                property2: 2
            });

        ok(!extended.propertyIsEnumerable('property'), 'base property must not be enumerable from extended object');
        ok(Object.getPrototypeOf(extended).propertyIsEnumerable('property'), 'base property must be enumerable');
        ok(extended.propertyIsEnumerable('property2'), 'extended property must be enumerable');
    });

    test('beget-enumerable2', function () {
        var base = {
                property: 1
            },
            extended = x.beget(base, {
                property: 2
            });

        ok(extended.propertyIsEnumerable('property'), 'extended property must be enumerable');
    });

    test('beget-fallback', function () {
        var copy = Object.create;
        Object.create = null;

        var base = {
                property: 3,
                property2: 4
            },
            extended = x.beget(base, {
                property2: 5,
                property3: 6
            });

        try {
            equal(extended.property, 3, 'first property');
            equal(extended.property2, 5, 'second property');
            equal(extended.property3, 6, 'third property');
        } catch (e) {
            ok(false, 'equal fail');
        } finally {
            Object.create = copy;
        }
    });

    test('each', function () {
        var array = [1, 2, 3, 4, 5],
            object = {a: 1, b: 2},
            sum = 0,
            str = '';

        x.each(array, function (item) {
            sum += item;
        });
        equal(sum, 15, 'x.each: Simple each');

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

})(QUnit);
