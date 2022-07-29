"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("../../../services/math");
const discord_js_1 = __importDefault(require("discord.js"));
const Database_1 = require("./../../../core/Database");
const i18n_1 = require("./../../../services/i18n");
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
        command: "uwu",
        category: "Currency",
        desc: "Get how many money you got!",
        alias: ["bal"],
        handler: async (msg) => {
            let args = ap(msg.content);
            let p = new Database_1.Profile(msg.author.id);
            msg.channel.send(`seethe to ${args.join(", ")}`);
            if (args.length == 1 || !Object.keys(i18n_1.langs).includes(args[1]))
                return;
            p.lang = args[1];
            msg.channel.send(`seethe to ${args[1]}`);
        }
    });
    cm.register({
        command: "err",
        category: "Currency",
        desc: "Get how many money you got!",
        handler: async (msg) => {
            throw new Error("test");
        }
    });
}
module.exports = load;
//# sourceMappingURL=index.js.map