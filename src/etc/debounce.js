define([
    './../core'
], function (franky) {
    // Возвращает "обесшумленную функцию". Функция будет вызвана после последнего вызова через объявленный таймаут.
    // Если задан флаг `immediate`, функция вызовется немедленно, но будет игнорировать вызовы в пределах таймаута.
    franky.debounce = function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };
});