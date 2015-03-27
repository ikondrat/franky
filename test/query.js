describe('query', function () {
    var mock = {},
        before = function () {
            mock.obj = {
                testData: {
                    "hello" : "world"
                }
            };
        },
        after = function () {
           mock = null;
        };
    it('fetches values from object', function () {
        before();

        var query = x.bind(x.query, mock.obj);

        // existed values
        expect(
            query("testData.hello")
        ).toBe("world");

        // nonexisted value returns empty string
        expect(
            query("tsestData.hellos")
        ).toBe(null);

        // deep test
        expect(
            x.bind(x.query, {
                a: {
                    b: {
                        d: {
                            z: {
                                whoisthere: "zul"
                            }
                        }
                    }
                }
            })("a.b.d.z.whoisthere")
        ).toBe("zul");

        // test for fetch array
        expect(
            x.bind(x.query, {
                a: {
                    b: {
                        d: [1,2]
                    }
                }
            })("a.b.d")
        ).toEqual([1, 2]);

        // test for fetch object
        expect(
            x.bind(x.query, {
                a: {
                    b: {
                        d: [1,2]
                    }
                }
            })("a.b")
        ).toEqual({
            d: [1,2]
        });

        after();
    });

});