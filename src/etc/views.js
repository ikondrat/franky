define([
    "./../core",
    "./../checks/isString"
], function (franky) {
    // View Module
    // --------------------

    // base constructor for view
    // > var myViews = franky.View();
    // myViews.let('hello', 'hello');
    // It can be based on existed view instance it's optional
    // var uberView = franky.View(myViews)
    franky.View = function (/**Object*/view) {
        this.templates = view && view.templates ?
            franky.beget(view.templates) :
        {};
    };

    franky.View.prototype = {
        templates: {},

        re: {
            "parse" : /\[\%\s+([^%]+)\s+\%\]/g,
            "rule": /:/
        },

        setParseRe: function (re) {
            this.re.parse = re;
        },

        getCustomRender: function () {
            var def = arguments[0] !== "undefined" ?
                arguments[0].split(this.re.rule) :
                null;

            if (def && def.length === 2) {
                return this.parseRules[def[0]] && this.parseRules[def[0]].call(this, def[1]);
            }
        },

        parseRules: {
            l10n: function(key){
                return function (d) {
                    if (franky.isDebug && !d.l10n(key)) {
                        franky.console.error("There is no translation for " + key);
                    }
                    return d.l10n ? d.l10n(key) : key;
                };
            },

            jpath: function(key) {
                return function (d) {
                    return franky.getJPathValue(d, key) || "";
                };
            },

            view: function(key) {
                var self = this;

                return function (d) {
                    return self.get(key, d);
                };
            }
        },

        ruleFunction: function (paramName, defaults, superTemplates) {
            var self = this;
            return this.getCustomRender(paramName) || function (d) {
                // Get value from `data` or from described `views`
                var res = d && d[paramName] ||
                    (d && d.views && d.views.get(paramName, d)) || "";

                // If result is still empty try to reach other resources
                if (!res) {
                    // first - try to walk through superTemplates
                    res =  superTemplates[paramName] ?
                        self.getContent(superTemplates[paramName], d) :
                        // or get values from described defaults in template declaration
                        defaults ? defaults[paramName] : "";
                }
                if (franky.isDebug && !res) {
                    franky.console.log(
                            "Undefined variable " + paramName
                    );
                }
                return res || "";
            };
        },

        // Returns processed string
        getContent: function (/**Array|Object*/tmpl, /**Object*/data) /**String*/{
            var res= "";
            // there are thre possible declarations array of functions, string and function
            // array case
            if (franky.isArray(tmpl)) {
                res = franky.map(tmpl, function (item) {
                    return typeof item === "string" ?
                        item:
                        item(data);
                }).join("");
            // function case
            } else if (franky.isFunction(tmpl)) {
                res = tmpl(data);
            // default string case
            } else {
                res = tmpl.toString();
            }

            return res;
        },

        // Gets transformed value by defined template and data
        "get": function (/**String*/name, /**Object*/data) /**String*/ {
            var self = this;
            var template = data && data.views ?
                data.views.templates[name] : this.templates[name];
            return self.getContent(template, data);
        }
    };

    // Declares template with name
    franky.View.prototype.let = function (/**String*/name, /**String|Function*/template, /**Object*/defaults) /**Object*/ {

        var result = this.templates[name] = [],
            self = this,
            i = 0;

        if (franky.isFunction(template)) {
            result.push(template);
        } else {
            template.replace(this.re.parse, function(matchedExpression, matchedKey, matchedIndex) {
                result.push(
                    template.substr(i, matchedIndex - i),
                    self.ruleFunction(matchedKey, defaults, self.templates)
                );
                i = matchedIndex + matchedExpression.length;
            });
            if (i < template.length) {
                result.push(template.substr(i));
            }
        }


        return this;
    };

    // We have default instanced view for manipulations
    // > franky.views.let('say', 'hello {{someone}}')
    // franky.views.get('say', {someone: "john"}) -> 'hello john'
    franky.views = new franky.View();
    
    /**
     * Creates a set of views for each lang
     * @param langs {array}
     * @param views {object} a set of base views for each lang in langs
     */
    franky.getViewsForLangs = function getViewsForLangs(/**Array*/langs, /**Object*/views) /**Object*/ {
        var res = {},
            x = this;
        langs.forEach(function createView(lang){
            var base;
            if(views){
                if(lang in views){
                    base = views[lang];
                }else{
                    throw new Error('No lang "' + lang + '" in base views.');
                }
            }
            res[lang] = new x.View(base);
        });
        return res;
    };
});