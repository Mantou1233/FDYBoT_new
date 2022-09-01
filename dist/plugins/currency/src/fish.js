"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const inventory_1 = __importDefault(require("../../../services/inventory"));
const Database_1 = require("../../../core/Database");
const loots_json_1 = require("../assets/loots.json");
const loot = loots_json_1.fishing;
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "fish",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, { prefix }) => {
            let p = new Database_1.Profile(msg.author.id);
            if (p.equip.rod === -1)
                return msg.channel.send(i18n.parse(msg.lang, "currency.fish.noRod", prefix, prefix));
            if (!loot[p.equip.rod])
                throw new Error("Your fishing rod equipped dont have any loot. try to unequip it");
            let result = {};
            for (let [k, v] of (Object.entries(loot[p.equip.rod]))) {
                result[k] = random(0, v);
                inventory_1.default.addItem(p, k, result[k]);
            }
            msg.channel.send({
                embeds: [
                    new discord_js_1.default.EmbedBuilder()
                        .setTitle("You caught:")
                        .setDescription((function (res, str = "") {
                        for (let [k, v] of Object.entries(res)) {
                            if (v < 1)
                                continue;
                            str += i18n.parse(msg.lang, "currency.format.result", inventory_1.default.toDisplay(msg.lang, k, false), `${v}\n`);
                        }
                        return str;
                    })(result))
                        .setColor(i18n.globe.color)
                ]
            });
            p.save();
        }
    });
}
exports.default = load;
//# sourceMappingURL=fish.js.map