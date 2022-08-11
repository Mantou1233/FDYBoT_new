"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inventory_1 = __importDefault(require("../../../services/inventory"));
const Database_1 = require("../../../core/Database");
const usable_1 = __importDefault(require("../assets/usable"));
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "use",
        category: "Currency",
        desc: "Use or open a item.",
        alias: ["open"],
        handler: async (msg, { prefix }) => {
            let args = ap(msg.content, true);
            let p = new Database_1.Profile(msg.author.id);
            if (!args[1])
                return;
            let item = inventory_1.default.getItems(args[1], Object.keys(usable_1.default.use));
            if (!item)
                return msg.channel.send(i18n.parse(msg.lang, "currency.format.subjectNotFoundOrUsable"));
            if (!p.inv[item])
                return msg.channel.send(i18n.parse(msg.lang, "currency.format.subjectDontHave"));
            await usable_1.default.use[item](msg, p);
        }
    });
    cm.register({
        command: "equip",
        category: "Currency",
        desc: "equip a item",
        handler: async (msg, { prefix }) => {
            let args = ap(msg.content, true);
            let p = new Database_1.Profile(msg.author.id);
            if (!args[1])
                return;
            let item = inventory_1.default.getItems(args[1], Object.keys(usable_1.default.equip));
            if (!item)
                return msg.channel.send(i18n.parse(msg.lang, "currency.format.subjectNotFoundOrUsable"));
            if (!p.inv[item])
                return msg.channel.send(i18n.parse(msg.lang, "currency.format.subjectDontHave"));
            if (p.equip.rod !== -1)
                return msg.channel.send(i18n.parse(msg.lang, "currency.equip.conflict", prefix));
            await usable_1.default.equip[item].add(msg, p);
        }
    });
    cm.register({
        command: "unequip",
        category: "Currency",
        desc: "unequip a item",
        handler: async (msg, { prefix }) => {
            let p = new Database_1.Profile(msg.author.id);
            if (p.equip.rod == -1)
                return msg.channel.send(i18n.parse(msg.lang, "currency.unequip.conflict"));
            if (!usable_1.default.equip[p.equip.rod]?.remove)
                throw new Error("Handler not found.");
            await usable_1.default.equip[p.equip.rod].remove(msg, p);
        }
    });
}
exports.default = load;
//# sourceMappingURL=use.js.map