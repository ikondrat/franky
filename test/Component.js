describe('Component', function () {
    var testVariable,
        mockd;

    x.Component.extend({
        id: 'aaa',
        init: function () {
            testVariable = 123;
        }
    });

    x.Component.extend({
        id: 'yyy',
        init: function () {
            testVariable = this.data('value') || 222;
        }
    });

    // initialize components
    describe('init', function () {

        it('by manual call' ,function () {
            x.Component.initById('aaa');
            expect(testVariable).toBe(123);
        });

        it('by search inside document fragment' ,function () {

            var doc = document.createElement('div'),
                testData = '';

            doc.setAttribute('data-xapp', 'hello');
            doc.setAttribute('data-var1', 'hello');
            doc.setAttribute('data-var2', 'world');

            x.Component.extend({
                'id': 'hello',
                'init': function () {
                    testData = this.var1 + ' ' + this.var2;
                }
            });
            x.Component.initByHTML(doc);
            expect(testData).toBe('hello world');
        });
    });

    // describe component as factory
    it('has ability to describe component as factory called by init', function () {
        var doc = document.createElement('div'),
            testData = '';

        doc.setAttribute('data-xapp', 'hellozull');
        doc.setAttribute('data-var1', 'there is only');
        doc.setAttribute('data-var2', 'zuul');

        // another way to describe components
        x.Component.extend('hellozull', function () {
            testData = this.var1 + ' ' + this.var2;
        });

        x.Component.initByHTML(doc);
        expect(testData).toBe('there is only zuul');
    });

    // DI pattern in components
    it('has ability to use Dependency Injection pattern', function () {
        var doc = document.createElement('div'),
            testData = '';

        doc.setAttribute('data-xapp', 'hellozullservice');
        // define core service
        x.Component.factory('$storage', function () {
            var publicApis = {
                getTest: function() {
                    return 'test from storage';
                }
            };
            return publicApis;
        });

        x.Component.extend('hellozullservice', [
            '$storage', function ($storage) {
                testData = $storage.getTest();
            }
        ]);
        x.Component.initByHTML(doc);
        expect(testData).toBe('test from storage');
    });

    // Init from document
    it('is also possible to start init from document', function () {
        var doc = document.createElement('div'),
            testData = '';

        doc.setAttribute('data-xapp', 'hellozullservice2');

        x.Component.extend('hellozullservice2', [
            '$storage', function ($storage) {
                testData = $storage.getTest();
            }
        ]);

        document.body.appendChild(doc);
        x.Component.initByHTML();

        expect(testData).toBe('test from storage');
    });

    // Init with several deps in DI
    it('is possible to require several deps in DI', function () {
        var doc = document.createElement('div'),
            testData = '';

        doc.setAttribute('data-xapp', 'uberapp');
        // define core service
        x.Component.factory('$http', function () {
            var publicApis = {
                get: function(path, callback) {
                    callback('follow the white rabbit');
                }
            };
            return publicApis;
        });

        x.Component.extend('uberapp', [
            '$storage', '$http', function ($storage, $http) {
                $http.get('/uberpath', function (data) {
                    testData = $storage.getTest() + ' ' + data;
                });
            }
        ]);

        x.Component.initByHTML(doc);
        expect(testData).toBe('test from storage follow the white rabbit');
    });
});