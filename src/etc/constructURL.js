define([
    "./../core"
], function( franky ) {
    /**
     * Appends query parameters to specified URI
     * @param {String} url    URI for append query
     * @param {Object} params Query params by key:value
     *
     * @returns {String} URI with inserted query parameters
     */
    franky.constructURL = function (url, params) {
        var res = "",
            query = [],
            item,
            items = url.match(/((?:https?\:)?(?:\/)?\/[^?]+)\?([^#]+)?(\#\S+)?/),
            hashValue = items && items[3] ? items[3] : "";

        if (items && items[2]) {
            var cquery = items[2].split("&"),
                i = cquery.length;

            while (i--) {
                query.push(cquery[i]);
            }
        }
        for (item in params) {
            if (params.hasOwnProperty(item)) {
                query.push(item + "=" + params[item]);
            }
        }

        if (items) {

            res = items[1] + "?" + query.join("&") + hashValue;
        } else {
            res = url + "?" + query.join("&") + hashValue;
        }

        return res;
    };

});