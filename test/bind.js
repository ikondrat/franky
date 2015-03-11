describe('bind', function () {

    it('is possible to bind context', function () {
        var f = x.bind(function () {
                return this.a + this.b;
            }, {
                a: 1,
                b: 4
            });

        expect(
            f()
        ).toBe(5);

        expect(
            f.call({a: 123})
        ).toBe(5);

        expect(
            f.apply({b: 2})
        ).toBe(5);
        
    });

});