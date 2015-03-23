describe('isString', function () {

    it('is checks for all arguments to be strings', function () {
        expect(
            x.isString("hello", "world")
        ).toBe(true);

        expect(
            x.isString("hello", 123123)
        ).toBe(false);

    });

});