"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const quick_db2_1 = __importDefault(require("quick.db2"));
const Schema_1 = __importDefault(require("./structure/Schema"));
const db = (0, quick_db2_1.default)("json");
const suffix = "";
class Profile {
    constructor(id) {
        this.__id = id;
        const data = db.get(`${id}${suffix}`) ?? -1;
        if (data == -1)
            return this;
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
    }
    check() {
        return Boolean(db.get(`${this.__id}${suffix}`) ?? false);
    }
    newSchema(initType = "user") {
        if (!initType || initType == "none" || !Schema_1.default[initType])
            return false;
        Object.assign(this, Schema_1.default[initType]);
        return void this.save() ?? this;
    }
    updateSchema(initType = "user") {
        if (!initType || initType == "none" || !Schema_1.default[initType])
            return false;
        let raw = this.raw;
        Object.assign(this, Schema_1.default[initType], raw, {
            commandInfo: Object.assign({}, Schema_1.default[initType].commandInfo, raw.commandInfo)
        });
        return void this.save() ?? this;
    }
    save() {
        const data = JSON.parse(JSON.stringify(this));
        delete data["__id"];
        return void db.set(`${this.__id}${suffix}`, data) ?? this;
    }
    get raw() {
        const tmp = JSON.parse(JSON.stringify(this));
        delete tmp["__id"];
        return tmp;
    }
}
exports.Profile = Profile;
//# sourceMappingURL=Database.js.map