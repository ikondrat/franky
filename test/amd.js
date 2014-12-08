describe("amd", function () {

    x.amd.define("firstLib", function () {

        return {
            value: "Lorem"
        };
    });

    x.amd.define("secondLib", function () {

        return {
            value: "ipsum"
        };
    });


    it("has DI pattern", function () {
        var res = "ololo";
        x.amd.require('firstLib', 'secondLib', function (a, b) {
            res = a.value + " " +  b.value;
        });

        expect(res).toEqual("Lorem ipsum");
    });
});