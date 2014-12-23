define([
    './../core',
    '../etc/debounce'
], function (franky) {

    franky.amd.define(
        'statlog',
        function () {
            var root = null,
                clckDemonHost = 'http://clck.yandex.ru/counter',
                clckDemonPath = '/dtype=%s/session_id=%s/events=%s/*',
                params = {
                    type: 'show',
                    root: 'testRoot',
                    statDataAttr: 'statlog',
                    dataNoRedirKey: 'statlog-noredir',
                    doc: null,
                    sendAtWill: true,
                    dataReadyKey: 'statlog-ready',
                    clickEvent: 'mousedown',
                    skipVisibleCheck: false,
                    statEnabled: false,
                    clickCounter: function (path, element) {
                        element = element || null;
                        window.cp(getRoot() + '.' + path, element);
                    }
                },
                getRoot = function () {
                    return typeof Lego !== 'undefined' && Lego.params && Lego.params.statRoot ? Lego.params.statRoot : params.root;
                },
                dumpDATA = function (params) {
                    var res = [];
                    if (root) {
                        res = JSON.stringify([{
                            event: params.type,
                            "parent-path": getRoot(),
                            blocks: root.children
                        }]);
                    }
                    return res;
                },
                isEnabled = function () {
                    return typeof Lego !== 'undefined' && Lego.params ? Lego.params.statEnabled  : params.statEnabled;
                },
                handleClicks = function () {
                    // используем делегирование для обработки клика
                    $(params.doc || document).on(params.clickEvent, "*[data-" + params.statDataAttr + "]", function (e) {
                        // считаем клики только когда пользователь попадает в выборку
                        if (isEnabled()) {
                            var clickPath = $(this).data(params.statDataAttr),
                                notRedirect = $(this).data(params.dataNoRedirKey);

                            if (clickPath) {
                                params.clickCounter(clickPath, notRedirect ? null : this);

                                if (notRedirect) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        }

                    });
                };

            handleClicks();

            return {
                // Для того, чтобы сторонние компоненты могли смотреть на настройки - рассказываем о них в инстансе
                params: params,

                getSingleRequest : function (data) {

                    return franky.stringf(
                        clckDemonHost + clckDemonPath,
                        data.project,
                        data.showId,
                        JSON.stringify([{
                            "event": data.event,
                            "parent-path": data.path.substr(0, data.path.lastIndexOf('.')),
                            "blocks": [{
                                ctag: data.path.substr(data.path.lastIndexOf('.') + 1)
                            }]
                        }])
                    );
                },
                singleLog: function (statPath) {
                    var url = this.getSingleRequest({
                        project: 'clck',
                        showId: this.getShowID(),
                        event: 'show',
                        path: getRoot() + '.' + statPath
                    });
                    var img = new Image();
                    img.src = url;
                },
                // Балковое логирование с использованием CORS
                bulkLog: function (/**String*/statPath) /**Object*/ {
                    var current = root ? root : root = {},
                        self = this;

                    franky.forEach(statPath.split('.'), function (key) {
                        var existFunction = function (child) {
                            return child.ctag === key;
                        };
                        if (!current.children) {
                            current.children = [];
                        }

                        var tryToGet = franky.filter(current.children, existFunction);
                        if (!tryToGet.length) {
                            current.children.push({
                                ctag: key
                            });
                        }
                        current = franky.filter(current.children, existFunction)[0];
                    });

                    if (params.sendAtWill) {
                        self.send();
                    }
                    return this;
                },
                // Логирование счетчика с заданным путем в виде аргумента
                // e.g. statlog.add('v12.head.login').
                log: function (statPath) {
                    // Для браузеров не поддерживающих балковое логирование в виде CORS запроса используем одиночные запросы
                    var logFunc = $.support.cors ? this.bulkLog : this.singleLog;

                    // проверяем наличие пути к статистике и флаг логирования
                    if (typeof statPath !== 'undefined' && isEnabled()) {
                        return logFunc.call(this, statPath);
                    }
                },
                // добавление счетчиков по результат парсинга куска DOM
                logByDocument: function (/**Object*/p) {

                    var _params = franky.beget(params, p),
                        self = this,
                        attrName = 'data-' + _params.statDataAttr,
                        dataKey = attrName.substr(5),
                        dataNoRedirKey = dataKey + '-noredir',
                        exp =  "*["+attrName+"]",
                        l = _params.doc ? $(_params.doc).find(exp) : $(exp);

                    // обходим все элементы с data-statlog - считаем их 'элементами' для обсчета статистикой
                    $(l).each(function () {
                        // проверяем состояние видимости элемента
                        if ($(this).is(':visible') || _params.skipVisibleCheck) {
                            if (!attrName.match(/^data-/)) {
                                throw new Error("data attribute expected as statAttr");
                            }

                            // забираем путь к счетчику, считая что это дата-атрибут
                            var dataPath = $(this).data(dataKey);

                            // Чтобы не считать элемент несколько раз - используем специальный флаг
                            if (!$(this).data(_params.dataReadyKey)) {

                                // складываем в хранилище логера

                                self.log(dataPath);
                                $(this).data(_params.dataReadyKey, dataPath);
                            }

                        }
                    });
                },

                // дамп залогированных счетчиков
                dumpDATA: dumpDATA,

                // Returns showID as string
                getShowID: function () /**String*/ {
                    var res = "";
                    if (typeof Lego !== 'undefined' && Lego.params && Lego.params.msid) {
                        res = Lego.params.msid;
                    }
                    return res;
                },

                // Отправка запроса в статистику
                send: franky.debounce(function () {
                    if (root) {
                        $.ajax({
                            type: "POST",
                            url: clckDemonHost,
                            data: franky.stringf(
                                clckDemonPath,
                                'clck',
                                this.getShowID(),
                                dumpDATA(params)
                            ),
                            success: function () {
                                root = null;
                            }
                        });
                    }
                }, 1000)
            };
        }
    );
});