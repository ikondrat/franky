describe('Strings', function () {

    it('trim', function () {
        expect(
            x.trim(" a  a ")
        ).toBe("a  a");
    });

    it('stripSpaces', function () {
        expect(
            x.stripSpaces("blah     blah  blah 11")
        ).toBe("blahblahblah11");
        expect(
            x.stripSpaces(" blah    blah  ")
        ).toBe("blahblah");
    });

    it('constructURL', function () {

        expect(
            x.constructURL("http://www.yandex.ru", {
                "text": 1,
                "hello": "world"
            })
        ).toBe(
            'http://www.yandex.ru?text=1&hello=world'
        );

        expect(
            x.constructURL("http://www.google.com?", {
                "search": "ololo",
                "q.test": "q.ok"
            })
        ).toBe(
            'http://www.google.com?search=ololo&q.test=q.ok'
        );

        expect(
            x.constructURL("http://www.google.com?", {
                "text": ""
            })
        ).toBe(
            'http://www.google.com?text='
        );

        expect(
            x.constructURL("http://www.yandex.com/q.test/?vow=q.test", {
                "search": "ololo",
                "q.test": "q.ok"
            })
        ).toBe(
            'http://www.yandex.com/q.test/?vow=q.test&search=ololo&q.test=q.ok'
        );

        expect(
            x.constructURL("http://www.yandex.com:5674/q.test/?vow=q.test", {
                "search": "ololo",
                "q.test": "q.ok"
            })
        ).toBe(
            'http://www.yandex.com:5674/q.test/?vow=q.test&search=ololo&q.test=q.ok'
        );

        expect(
            x.constructURL("https://www.mail.ru?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            })
        ).toBe(
            'https://www.mail.ru?a=1&areurobot=yes&text=blah#anchor'
        );

        expect(
            x.constructURL("//myhomepage.com?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            })
        ).toBe(
            '//myhomepage.com?a=1&areurobot=yes&text=blah#anchor'
        );

        expect(
            x.constructURL("/q.test/?a=1#anchor", {
                "areurobot": "yes",
                "text": "blah"
            })
        ).toBe(
            '/q.test/?a=1&areurobot=yes&text=blah#anchor'
        );

        expect(
            x.constructURL('/q.test/', {
                areurobot: 'yes',
                text: 'blah'
            })
        ).toBe(
            '/q.test/?areurobot=yes&text=blah'
        );

        expect(
            x.constructURL('/q.test', {
                areurobot: 'yes',
                text: 'blah'
            })
        ).toBe(
            '/q.test?areurobot=yes&text=blah'
        );
    });

    it('stringf', function () {

        expect(
            x.stringf(
                "Lorem ipsum dolor %s, consectetur adipisicing elit%s sed do %s tempor",
                'sit amet',
                ',',
                'eiusmod'
            )
        ).toBe(
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor'
        );
    });
});