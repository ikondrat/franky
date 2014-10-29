describe('Stuff for components', function () {

});
/* global x */
/* jshint multistr: true */
(function (q) {
    "use strict";
    var testVariable;

    q.module('franky');

    x.Component.extend({
        id: "aaa",
        init: function () {
            testVariable = 123;
        }
    });

    x.Component.extend({
        id: "yyy",
        init: function () {
            testVariable = this.data("value") || 222;
        }
    });

    q.test('Component: custom call of init', function() {
        x.Component.initById("aaa");
        q.equal(
            testVariable,
            123,
            "The result must be 123"
        );
    });

    q.test('Component: check init', function() {
        var doc = document.createElement('div'),
            testData = "";

        doc.setAttribute("data-xapp", "hello");
        doc.setAttribute("data-var1", "hello");
        doc.setAttribute("data-var2", "world");

        x.Component.extend({
            'id': "hello",
            'init': function () {
                testData = this.var1 + " " + this.var2;
            }
        });
        x.Component.initByHTML(doc);
        q.equal(
            testData,
            "hello world",
            "check init failed"
        );
    });

    q.test('Component: init new version', function() {
        var doc = document.createElement('div'),
            testData = "";

        doc.setAttribute("data-xapp", "hellozull");
        doc.setAttribute("data-var1", "there is only");
        doc.setAttribute("data-var2", "zuul");

        x.Component.extend("hellozull", function () {
            testData = this.var1 + " " + this.var2;
        });

        x.Component.initByHTML(doc);
        q.equal(
            testData,
            "there is only zuul",
            "check init failed"
        );
    });

    q.test('Component: init new version with service dependency', function() {
        var doc = document.createElement('div'),
            testData = "";

        doc.setAttribute("data-xapp", "hellozullservice");
        // define core service
        x.Component.factory("$storage", function () {
            var publicApis = {
                getTest: function() {
                    return "test from storage";
                }
            };
            return publicApis;
        });

        x.Component.extend("hellozullservice", [
            '$storage', function ($storage) {
                testData = $storage.getTest();
            }
        ]);

        x.Component.initByHTML(doc);
        q.equal(
            testData,
            "test from storage",
            "check init failed"
        );
    });

    q.test('Component: init by initByHTML from document', function() {
        var doc = document.createElement('div'),
            testData = "";

        doc.setAttribute("data-xapp", "hellozullservice2");

        x.Component.extend("hellozullservice2", [
            '$storage', function ($storage) {
                testData = $storage.getTest();
            }
        ]);

        document.body.appendChild(doc);
        x.Component.initByHTML();

        q.equal(
            testData,
            "test from storage",
            "init by initByHTML from document failed"
        );
    });

    q.test('Component: init new version with several dependencies', function() {
        var doc = document.createElement('div'),
            testData = "";

        doc.setAttribute("data-xapp", "uberapp");
        // define core service
        x.Component.factory("$http", function () {
            var publicApis = {
                get: function(path, callback) {
                    callback('follow the white rabbit');
                }
            };
            return publicApis;
        });

        x.Component.extend("uberapp", [
            '$storage', '$http', function ($storage, $http) {
                $http.get("/uberpath", function (data) {
                    testData = $storage.getTest() + " " + data;
                });
            }
        ]);

        x.Component.initByHTML(doc);
        q.equal(
            testData,
            "test from storage follow the white rabbit",
            "Init with several dependencies failed"
        );
    });
})(QUnit);
