"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("./i18n");
class InventoryManager {
    toDisplay(lang = "en", id, raw = true, prefix = "item.") {
        let st = i18n.parse(lang, `-${prefix}${id}`);
        let icon = prefix.includes("item") ? (raw ? "" : (i18n.icon[`item.${id}`] ?? i18n.icon["item.wip"]) + " ") : "";
        return (st === "%s" ? `${icon}${id.replaceAll("_", " ")}` : `${icon}${st}`);
    }
    getItems(id, list = [], prefix = "item.") {
        if (list.length == 0)
            return;
        let obj = {};
        for (let ea of list) {
            obj[ea] = [ea];
            for (let lang of Object.keys(i18n_1.langs)) {
                obj[ea].push(i18n.parse(lang, `-${prefix}${ea}`).replace("%s", `${ea}`));
            }
            obj[ea] = [...new Set(obj[ea])];
        }
        for (let [key, lit] of Object.entries(obj)) {
            if (lit.includes(id.replaceAll(" ", "_")))
                return obj[key][0];
        }
        return undefined;
    }
    addItem(p, id, count = 1) {
        if (p.inv[id])
            p.inv[id] += count;
        else
            p.inv[id] = count;
    }
    removeItem(p, id, count = 1) {
        p.inv[id] -= count;
        if (p.inv[id] < 1)
            delete p.inv[id];
    }
    deleteItem(p, id) {
        if (p.inv[id])
            delete p.inv[id];
    }
    hasItem(p, id, count = 1) {
        if (p.inv[id] && p.inv[id] >= count)
            return true;
        return false;
    }
}
exports.default = new InventoryManager();
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
//# sourceMappingURL=inventory.js.map