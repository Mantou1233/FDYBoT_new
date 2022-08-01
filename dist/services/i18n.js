"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globes = exports.langAlias = exports.langs = void 0;
const en_json_1 = __importDefault(require("../assets/lang/en.json"));
const zh_cn_json_1 = __importDefault(require("../assets/lang/zh_cn.json"));
const zh_tw_json_1 = __importDefault(require("../assets/lang/zh_tw.json"));
exports.langs = { en: en_json_1.default, cn: zh_cn_json_1.default, tw: zh_tw_json_1.default };
exports.langAlias = {
    zh: ["zh-cn"],
    tw: ["zh-tw"]
};
exports.globes = {
    color: parseInt("CFF2FF", 16)
};
class i18n {
    constructor() {
        this.globe = exports.globes;
    }
    parse(lang, string, ...opt) {
        if (string.startsWith("-"))
            string = string.slice(1);
        if (!Object.keys(exports.langs).includes(lang))
            throw new Error("No lang specified found!");
        let str = exports.langs[lang][string] ?? exports.langs["en"][string] ?? "%s";
        for (let ot of opt)
            str = str.replace("%s", `${ot}`);
        return str;
    }
}
globalThis.i18n = new i18n();
//# sourceMappingURL=i18n.js.map