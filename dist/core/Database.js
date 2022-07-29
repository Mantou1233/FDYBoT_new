"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const quick_db_1 = __importDefault(require("quick.db"));
const Schema_1 = __importDefault(require("./structure/Schema"));
const suffix = "";
class Profile {
    constructor(id) {
        this.__id = id;
        const data = quick_db_1.default.get(`${id}${suffix}`) ?? -1;
        if (data == -1)
            return this;
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
    }
    check() {
        return Boolean(quick_db_1.default.get(`${this.__id}${suffix}`) ?? false);
    }
    newSchema(initType = "user") {
        if (!initType || initType == "none")
            return false;
        for (const [key, value] of Object.entries(Schema_1.default)) {
            if (initType === key) {
                quick_db_1.default.set(`${this.__id}${suffix}`, value);
                Object.assign(this, value);
                break;
            }
        }
        return this;
    }
    updateSchema(initType = "user") {
        if (!initType || initType == "none")
            return false;
        for (const [key, value] of Object.entries(Schema_1.default)) {
            if (this[key])
                continue;
            this[key] = value;
        }
        return void this.save() ?? this;
    }
    save() {
        const data = JSON.parse(JSON.stringify(this));
        delete data["__id"];
        return void quick_db_1.default.set(`${this.__id}${suffix}`, data) ?? this;
    }
    get raw() {
        const tmp = JSON.parse(JSON.stringify(this));
        delete tmp["__id"];
        return tmp;
    }
}
exports.Profile = Profile;
//# sourceMappingURL=Database.js.map