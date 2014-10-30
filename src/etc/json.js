define([
    "./../core"
], function (franky) {
    if (typeof JSON === "undefined") {
        throw new Error("JSON is not supported");
    }
    franky.JSON = JSON;
});