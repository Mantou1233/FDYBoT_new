import db from "quick.db";
import Schema from "./structure/Schema";
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
        if (!initType || initType == "none") return false;
        for (const [key, value] of Object.entries(Schema)) {
            if (initType === key) {
                db.set(`${this.__id}${suffix}`, value);
                Object.assign(this, value);
                break;
            }
        }
        return this;
    }

    updateSchema(initType = "user"){
        if (!initType || initType == "none") return false;
        for (const [key, value] of Object.entries(Schema)) {
            if (this[key]) continue;
            this[key] = value;
        }
        return void this.save() ?? this;
    }

    save() {
        const { __id: id } = this;
        const data = JSON.parse(JSON.stringify(this));
        delete data["__id"];
        db.set(`${id}${suffix}`, data);
        return this;
    }

    get raw() {
        const tmp = JSON.parse(JSON.stringify(this));
        delete tmp["__id"];
        return tmp;
    }
}
