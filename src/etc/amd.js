define([
    "./../core",
    '../etc/toArray'
], function (franky) {
    // микромодуль для модульного написания кода
    var libs = {},
        cached = {};
    franky.amd = {
        // определяем модуль, по дефолту считаем что будем кешировать порожденную фабрику и по сути делать синглтон
        // e.g. franky.amd.define('myCarFactory', function () { return {serial: 123}; })
        define: function (/**String*/id, /**Function*/lib, /**Boolean*/ runOnce) /**Object*/{
            runOnce = runOnce || true;
            libs[id] = lib;
            if (runOnce) {
                cached[id] = true;
            }
            return this;
        },
        // Обрабатывает зависимости и выполняет callback функцию в случае удовлетворения всех зависимостей
        // e.g. franky.amd.require('myCarFactory', function (carObject) {} );
        require: function () {
            // все аргументы, кроме последнего считаются необходимыми зависимостями
            var depsList = franky.toArray(arguments).slice(0, arguments.length - 1),
            // последний аргумент - функция в которую уйдут удовлетворенные зависимости
                callback = arguments[arguments.length - 1];
            // обработка зависимостей
            depsList = franky.map(depsList, function (depsItem) {
                if (!libs[depsItem]) {
                    throw new Error('Unmet dependency:' + depsItem);
                }
                // если модуль представляет из себя синглтон - кешируем его
                if (cached[depsItem]) {
                    libs[depsItem] = franky.isFunction(libs[depsItem]) ? libs[depsItem]() : libs[depsItem];
                    return libs[depsItem];
                } else {
                    return libs[depsItem]();
                }
            });

            // пробрасываем удовлетворенные зависимости
            callback.apply(this, depsList);

            return this;
        }
    };
});