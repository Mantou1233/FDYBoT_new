"use strict";
exports.__esModule = true;
exports.globes = exports.langAlias = exports.langs = void 0;
var en_json_1 = require("../assets/lang/en.json");
var zh_zh_json_1 = require("../assets/lang/zh_zh.json");
var zh_tw_json_1 = require("../assets/lang/zh_tw.json");
var icons_json_1 = require("../assets/icons.json");
exports.langs = { en: en_json_1["default"], zh: zh_zh_json_1["default"], tw: zh_tw_json_1["default"] };
exports.langAlias = {
    en: ["en", "english"],
    zh: ["zh", "zh-cn", "简体中文"],
    tw: ["tw", "zh-tw", "繁體中文"]
};
exports.globes = {
    color: "CFF2FF"
};
var i18n = /** @class */ (function () {
    function i18n() {
        this.globe = exports.globes;
        this.icon = icons_json_1["default"];
    }
    i18n.prototype.parse = function (lang, string) {
        var _a, _b;
        var opt = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            opt[_i - 2] = arguments[_i];
        }
        if (string.startsWith("-"))
            string = string.slice(1);
        if (!Object.keys(exports.langs).includes(lang))
            throw new Error("No lang specified found!");
        var str = (_b = (_a = exports.langs[lang][string]) !== null && _a !== void 0 ? _a : exports.langs["en"][string]) !== null && _b !== void 0 ? _b : "%s";
        if (typeof str != "string")
            return str;
        for (var _c = 0, opt_1 = opt; _c < opt_1.length; _c++) {
            var ot = opt_1[_c];
            str = str.replace("%s", "".concat(ot));
        }
        return str;
    };
    return i18n;
}());
globalThis.i18n = new i18n();
