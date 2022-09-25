import db from "quick.db"; // TODO go fuck off quick db and use sqlite 
import Schema from "./structure/Schema";
import lodash from "lodash";
const suffix = "";

export class Profile {
    [key: string]: any;

    constructor(id) {
        this.__id = id;
        const data = db.get(`${id}${suffix}`) ?? -1;
        if (data == -1) return this;
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
    }

    check(): boolean {
        return Boolean(db.get(`${this.__id}${suffix}`) ?? false);
    }
    newSchema(initType = "user") {
        if (!initType || initType == "none" || !Schema[initType]) return false;
        Object.assign(this, Schema[initType]);
        return void this.save() ?? this;
    }

    updateSchema(initType = "user"){
        if (!initType || initType == "none" || !Schema[initType]) return false;
        let raw = this.raw;
        Object.assign(this, Schema[initType], raw, {
            commandInfo: Object.assign({}, Schema[initType].commandInfo, raw.commandInfo)
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
