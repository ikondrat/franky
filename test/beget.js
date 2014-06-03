/* global x, ok*/

(function () {
    "use strict";

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
})();
