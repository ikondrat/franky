describe("Base", function () {

    // dataset
    it("has facade for dataset html5 feature", function () {
        var el = document.createElement('div'),
            testData = "";

        el.setAttribute("data-var1", "hello");
        el.setAttribute("data-var2", "world");
        el.setAttribute("data-var3", "againt");

        var data = x.dataset(el);
        expect(
            data.var1
        ).toEqual("hello");

        expect(
            data.var1 + " " + data.var2
        ).toEqual("hello world");

        expect(
            data.someUndefined
        ).toEqual(undefined);
    });

    // check utils
    describe("contains check utils", function () {
        var arr = [2,3,4],
            arrLike = {},
            obj = {
                x: 1,
                y: 2
            };
        Array.prototype.push.call(arrLike, 1);

        it("isArray", function () {
            expect(x.isArray(arr)).toBe(true);
            expect(x.isArray(arrLike)).toBe(false);
            expect(x.isArray(obj)).toBe(false);
        });

        it("isArrayLike", function () {
            expect(x.isArrayLike(arrLike)).toBe(true);
            expect(x.isArrayLike(obj)).toBe(false);
        });

        it("isFunction", function () {
            expect(x.isFunction(function(){})).toBe(true);

            expect(x.isFunction({})).toBe(false);

            expect(x.isFunction(true)).toBe(false);

            expect(x.isFunction(Function.prototype.call, String.prototype.indexOf)).toBe(true);

            expect(x.isFunction(Function.prototype.call, {})).toBe(false);
        });

        it("isURL", function () {

            expect(
                x.isURL("http://www.yandex.ru/?s=1")
            ).toBe(true);

            expect(
                x.isURL("https://www.google.com/path/#aaa")
            ).toBe(true);

            expect(
                x.isURL("12234")
            ).toBe(false);

            expect(
                x.isURL("//ololo.org")
            ).toBe(false);

            expect(
                function(){ x.isURL({a:1}); }
            ).toThrow(new Error("isURL expects string parameter instead object"));

            expect(
                function(){ x.isURL(function(){}); }
            ).toThrow(new Error("isURL expects string parameter instead function"));
        });
    });

    // beget
    it("has ability to bind objects through prototype chain with beget", function () {
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

        expect(customObject.variable).toBe(1);
        expect(customObject.str).toBe('hello');
        expect(customObject.obj.test).toBe(1);

        expect(customObject.hasOwnProperty("variable")).toBe(false);
        expect(begetObjectX.ololo).toBe(2);
        expect(begetObject.ololo).toBe(1);

        var base = {
                property: 1
            },
            extended = x.beget(base, {
                property2: 2
            }),
            nextExt = x.beget(base, {
                property: 2
            });
        expect(extended.propertyIsEnumerable('property')).toBe(false);
        expect(Object.getPrototypeOf(extended).propertyIsEnumerable('property')).toBe(true);
        expect(extended.propertyIsEnumerable('property2')).toBe(true);

        expect(nextExt.propertyIsEnumerable('property')).toBe(true);

        var copy = Object.create;
        Object.create = null;

        var baseN = {
                property: 3,
                property2: 4
            },
            extendedN = x.beget(baseN, {
                property2: 5,
                property3: 6
            });
        try {
            expect(extendedN.property).toBe(3);
            expect(extendedN.property2).toBe(5);
            expect(extendedN.property3).toBe(6);
        } finally {
            Object.create = copy;
        }
    });

    // each
    it("has iterator for object's properties - each", function () {
        var array = [1, 2, 3, 4, 5],
            object = {a: 1, b: 2},
            sum = 0,
            str = '';

        expect(
            function(){ x.each([1, 2, 3, 4, 5], function (item) {})}
        ).toThrow(new Error("Each for array is deprecated - use x.forEach"));

        x.each(object, function (item, key) {
            sum += this[key];
            str += key;
        }, object);

        expect(
            sum
        ).toBe(3);

        expect(
            str.split("").sort().join("")
        ).toBe('ab');
    });
});