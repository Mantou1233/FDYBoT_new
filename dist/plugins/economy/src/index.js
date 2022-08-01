"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("../../../services/math");
const discord_js_1 = __importDefault(require("discord.js"));
const Database_1 = require("./../../../core/Database");
const inventory_1 = __importDefault(require("../../../services/inventory"));
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "balance",
        category: "Currency",
        desc: "Get how many money you got!",
        alias: ["bal"],
        handler: async (msg) => {
            let p = new Database_1.Profile(msg.author.id);
            const percent = (0, math_1.toPercent)(p.bank, p.bankAmount);
            const bar = (0, math_1.progressBar)((0, math_1.toSizing)(p.bank, p.bankAmount), 100, 10);
            const embed = new discord_js_1.default.EmbedBuilder()
                .setColor("#CFF2FF")
                .setTitle(`${p.name}'s profile`)
                .setDescription(`Wallet: ${p.coin}\nBank: ${p.bank} / ${p.bankAmount} (${bar}${percent})`);
            msg.channel.send({ embeds: [embed] });
        }
    });
    cm.register({
        command: "inventory",
        category: "Currency",
        desc: "See what do you got in your inventory",
        alias: ["inv"],
        handler: async (msg) => {
            let id = msg.author.id;
            let args = ap(msg.content, true);
            let p = new Database_1.Profile(`${id}`);
            let text = "";
            for (let [item, count] of p.inv.entryz()) {
                if (count === 0) {
                    delete p.inv[item];
                    continue;
                }
                text += `${inventory_1.default.toDisplay(item)} ─ ${count}\n`;
            }
            p.save();
            const embed = new discord_js_1.default.EmbedBuilder()
                .setColor("#CFF2FF")
                .setTitle(`${p.name}'s inventory`)
                .setDescription(text);
            msg.channel.send({ embeds: [embed] });
        }
    });
}
module.exports = load;
//# sourceMappingURL=index.js.map