describe('range function', function () {

    it('is shortcut to make loops', function () {
        var checkSum = 0;
        x.range('...10', function (i) {
            checkSum += i;
        });
        expect(
            checkSum
        ).toBe(45);
    });

    it('is possible to have range from...to', function () {
        var checkSum = 0;
        x.range('10...20', function (i) {
            checkSum++;
        });
        expect(
            checkSum
        ).toBe(10);
    });
});