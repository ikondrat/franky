describe('Set datasctructure', function () {

    var s = new x.Set();

    it('is storage of unique value', function () {
        s.add('hello');
        s.add('hello');
        s.add('hello');
        s.add('hello');
        s.add('world');
        s.add('hello');
        expect(
            s.size()
        ).toBe(2);
    });

    it('with a posibility to remove values', function () {
        s.remove('world');
        expect(
            s.size()
        ).toBe(1);
    });


    it('with a posibility to remove values', function () {
        s.remove('world');
        expect(
            s.size()
        ).toBe(1);
    });

    it('with a posibility to check of existing', function () {
        expect(
            s.has('hello')
        ).toBe(true);
        expect(
            s.has('world')
        ).toBe(false);
    });

    it('gives ability to iterate over values', function () {
        s.add(' ');
        s.add('Peter');
        var res = "";
        s.iterate(function (value) {
            res += value;
        });
        expect(
            res
        ).toBe("hello Peter");
    });

    it('has also empty checkers', function () {
        expect(
            s.isEmpty()
        ).toBe(false);

        while(!s.isEmpty()) {
            s.removeFirst();
        }
    });
});