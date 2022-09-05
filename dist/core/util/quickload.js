"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rez = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const rez = (s) => s.replaceAll("\\", "/");
exports.rez = rez;
class QuickLoader {
    cfg;
    constructor(cfg) {
        this.cfg = Object.assign({}, {
            filter: (s) => true,
            pattern: ["**/*.js", "**/*.ts"],
            include: [],
            excludes: [],
        }, cfg);
    }
    async load(handler = ((v) => v)) {
        let result = await (0, fast_glob_1.default)(this.cfg.pattern);
        result = result.filter(v => this.cfg.filter(v) &&
            !this.cfg.excludes.includes(v) &&
            this.cfg.include.length == 0 ? true : this.cfg.include.some(v1 => v.includes(v1)));
        for (let each of result) {
            await handler(each);
        }
    }
}
exports.default = QuickLoader;
//# sourceMappingURL=quickload.js.map