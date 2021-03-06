describe("Arrays", function () {

    it("map", function () {
        expect(x.map([1,2,3,4,5], function (num) {
            return num + 1;
        })).toEqual([2,3,4,5,6]);
    });

    it("filter", function () {
        expect(x.filter([1,2,3,4,5,6,8,9,10,11], function (num) {
            return num%2;
        })).toEqual([1,3,5,9,11]);
    });

    it('some', function () {
        expect(x.some([1,2,3,4,5,6,8,9,10,11], function (num) {
            return num%2;
        })).toEqual(true);
    });

    it('indexOf', function () {
        expect(
            x.indexOf([1,2,3,4,5,6,8,9,10,11], 5)
        ).toEqual(4);
        expect(
            x.indexOf([1,2,3,4,5,6,8,9,10,11], 55)
        ).toEqual(-1);
    });
});