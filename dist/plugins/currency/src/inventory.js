"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const inventory_1 = __importDefault(require("../../../services/inventory"));
const Database_1 = require("../../../core/Database");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "stats",
        category: "Basic",
        desc: "Display information saved from you",
        handler: async (msg, { prefix }) => {
            let p = new Database_1.Profile(msg.author.id);
            msg.channel.send(`You chatted ${p.chatCount} times! \nLevel ${p.level}, ${p.exp[0]} / ${p.exp[1]}\nCurrently equipped ${p.equip.rod !== -1 ? inventory_1.default.toDisplay(msg.lang, p.equip.rod) : "no fishing rod"}`);
        }
    });
    cm.register({
        command: "inventory",
        category: "Currency",
        desc: "See what do you got in your inventory",
        alias: ["inv"],
        handler: async (msg) => {
            let id = msg.author.id;
            let p = new Database_1.Profile(`${id}`);
            let text = "";
            for (let [item, count] of Object.entries(p.inv)) {
                if (count === 0) {
                    delete p.inv[item];
                    continue;
                }
                text += `${inventory_1.default.toDisplay(msg.lang, item) + " ─ " + count}\n`;
            }
            p.save();
            const embed = new discord_js_1.default.EmbedBuilder()
                .setColor(i18n.globe.color)
                .setTitle(`${msg.author.username}'s inventory`)
                .addFields({ name: "Equipment", value: `currently equipped ${p.equip.rod == -1 ? "nothing" : inventory_1.default.toDisplay(msg.lang, p.equip.rod) + " as fishing rod"}`, inline: true })
                .addFields({ name: "Inventory", value: text, inline: true });
            msg.channel.send({ embeds: [embed] });
        }
    });
}
exports.default = load;
//# sourceMappingURL=inventory.js.map