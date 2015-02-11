describe("Views", function () {

    it("let", function () {
        x.views.let("helloName", "hello [% name %]").
           let("helloNameDef", "hello [% name %]", {
               name: 'Karl'
           });

        expect(
           x.views.get("helloName", {a: 1})
        ).toBe('hello ');

        expect(
           x.views.get("helloName", {name: 'Mark'})
        ).toBe('hello Mark');

        expect(
           x.views.get("helloNameDef")
        ).toBe('hello Karl');
   });

    it("setParseRe", function () {
        x.views.setParseRe(/{\s+([^}]+)\s+}/g);

        x.views.
          let("test", "hello world").
          let("test2", "here is { variable } something for { variable2 }");

        expect(
          x.views.get("test")
        ).toBe('hello world');

        expect(
          x.views.get("test2", {
              "variable": "exists",
              "variable2": "me"
          })
        ).toBe('here is exists something for me');
    });

    it("jpath", function () {
        x.views.setParseRe(/{\s+([^}]+)\s+}/g);

        x.views.let("testJpath", "here is { jpath:x.y.z }");

        expect(
            x.views.get("testJpath", {
                x: {
                    y: {
                        z: "hopla"
                    }
                }
            })
        ).toBe('here is hopla');
    });

    it("views call inside templates", function () {
        x.views.setParseRe(/{\s+([^}]+)\s+}/g);

        x.views.let("t1", "blah blah { view:t2 }").
            let("t2", "blah blah { view:t3 }").
            let("t3", "blah blah");

        expect(
            x.views.get("t1")
        ).toBe('blah blah blah blah blah blah');
    });

    it("parseRules extending", function () {
        x.views.parseRules.revert = function (key) {
            return function (d) {
                return key.split('').reverse().join('');
            };
        };

        x.views.let("testOlolo", "here is { revert:something }");

        expect(
            x.views.get("testOlolo")
        ).toBe('here is gnihtemos');
    });

    it("Views inherits", function () {
        x.views.let("t1", "Lorem ipsum { view:t2 }").
            let("t2", "dolor sit { view:t3 }").
            let("t3", "amet");

        var customViews = new x.View(x.views);
            customViews.let("t3", "oops");

        expect(
            customViews.get("t1", {views:customViews})
        ).toBe('Lorem ipsum dolor sit oops');
    });

    it("Example processing", function () {
        x.views.
            let('document', '{ doctype }<html{ document-attrs }><head>{ head }</head><body{ body-attrs }>{ body-content }</body></html>').
            let('head', '<title>{ title }</title>{ styles }{ scripts }').
            let('doctype', '<!DOCTYPE html>').
            let('document-attrs', ' lang="ru"').
            let('body-content', 'hello world').
            let('title', 'base title').
            let('styles', '<style>body {font-size: 1em;}</style>').
            let('scripts', '<script>alert("hello world")</script>').
            let('body-attrs', ' class="b-page"');

        var customViews = new x.View(x.views);

        expect(
            customViews.get("document", {views:customViews})
        ).toBe(
            '<!DOCTYPE html><html lang="ru">' +
            '<head>' +
            '<title>base title</title>' +
            '<style>body {font-size: 1em;}</style>' +
            '<script>alert("hello world")</script>' +
            '</head><body class="b-page">hello world</body></html>'
        );

        customViews.let("t3", "oops").
            let("title", "modified title").
            let("body-content", "Meine lieben Augustin");

        expect(
            customViews.get("document", {views:customViews})
        ).toBe(
            '<!DOCTYPE html><html lang="ru"><head><title>modified title</title>' +
            '<style>body {font-size: 1em;}</style><script>alert("hello world")</script></head><body class="b-page">Meine lieben Augustin</body></html>'
        );

        var extraCustomViews = new x.View(customViews);
        extraCustomViews.let("title", "uber title");

        expect(
            customViews.get("document", {views:extraCustomViews})
        ).toBe('<!DOCTYPE html><html lang="ru"><head><title>uber title</title><style>body {font-size: 1em;}</style>' +
            '<script>alert("hello world")</script></head><body class="b-page">Meine lieben Augustin</body></html>');

    });

    it("is possible to declare templates as functions", function () {
        x.views.
            let("t4", function(){ return "lorem ipsum"; }).
            let("t5", function(d) {
                return "lorem ipsum" + d["bar"];
            }).
            let('t6-inner', ' sit amet').
            let('t6', function() {
                return ('Lorem ipsum dolor' + x.views.get('t6-inner'));
            });

        expect(
            x.views.get('t4')
        ).toBe('lorem ipsum');

        expect(
            x.views.get('t5', { bar : ' dolor sit'})
        ).toBe('lorem ipsum dolor sit');

        expect(
            x.views.get('t6')
        ).toBe('Lorem ipsum dolor sit amet');

    });
    
    it("creates a set of views for langs", function(){
        var base = x.getViewsForLangs(['ru','en']),
            views = x.getViewsForLangs(['ru','en'], base);
        
        base.ru.let('t0', 'base ru');
        base.en.let('t0', 'base en');
        views.ru.let('t1', 'views ru');
        views.en.let('t1', 'views en');
        
        expect(views.ru.get('t0')).toBe('base ru');
        expect(views.en.get('t0')).toBe('base en');
        expect(views.ru.get('t1')).toBe('views ru');
        expect(views.en.get('t1')).toBe('views en');
        
    });
});