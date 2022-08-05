"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("../../../services/math");
const discord_js_1 = __importDefault(require("discord.js"));
const Database_1 = require("../../../core/Database");
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
                .setTitle(`${msg.author.username}'s profile`)
                .setDescription(`Wallet: ${p.coin}\nBank: ${p.bank} / ${p.bankAmount} (${bar}${percent})`);
            msg.channel.send({ embeds: [embed] });
        }
    });
    cm.register({
        command: "deposit",
        category: "Currency",
        desc: "Get how many money you got!",
        alias: ["dep"],
        handler: async (msg) => {
            let p = new Database_1.Profile(msg.author.id);
            let args = ap(msg.content);
            if (args.length === 1)
                return msg.channel.send("pleease give a amount of money you wish to deposit (or `all`)!");
            if (args[1] === "all") {
                let amount = p.bankAmount - p.bank;
                if (p.coin < amount) {
                    let stored = p.coin;
                    p.bank += p.coin;
                    p.coin -= p.coin;
                    msg.channel.send(`i have deposited ${stored} to your bank!`);
                    return p.save();
                }
                else {
                    p.coin -= amount;
                    p.bank = p.bankAmount;
                    msg.channel.send("i have filled your bank!");
                    p.save();
                    return;
                }
            }
            else {
                let amount = (args[1]);
                if (amount % 1 !== 0)
                    return msg.channel.send("please give me a value to deposit!");
                else if (amount < 0)
                    return msg.channel.send("please dont give me a negative value!");
                else if (amount > p.coin)
                    return msg.channel.send("you dont have that much coins to store into the bank!");
                else if (amount + p.bank > p.bankAmount)
                    return msg.channel.send("storing your argumented coins will fill up the bank! if you are willing to do that, use `>deposit alll`!");
                else {
                    p.coin -= amount;
                    p.bank += amount;
                    p.save();
                    return msg.channel.send(`success! you now have ${p.bank}$ in your bank.`);
                }
            }
        }
    });
    cm.register({
        command: "withdraw",
        category: "Currency",
        desc: "Get how many money you got!",
        alias: ["with", "wd"],
        handler: async (msg) => {
            let p = new Database_1.Profile(msg.author.id);
            let args = ap(msg.content);
            if (args.length === 1)
                return msg.channel.send("please give a amount of money you wish to withdraw (or `all`)!");
            if (args[1] == "all") {
                if (p.bank !== 0) {
                    let amount = p.bank;
                    p.coin += amount;
                    p.bank -= amount;
                    msg.channel.send("You have withdrawn everything in your bank to your wallet!");
                    return p.save();
                }
                else
                    return msg.channel.send("you got nothing in your inventory bozo :skull:");
            }
            else {
                let amount = (args[1]);
                if (amount % 1 !== 0)
                    return msg.channel.send("please give me a value to withdraw!");
                else if (amount < 0)
                    return msg.channel.send("please dont give me a negative value!");
                else if (amount > p.bank)
                    return msg.channel.send("you dont have that many coins in the bank! if you are willing to do that, use `>withdraw alll`!");
                else {
                    p.coin += amount;
                    p.bank -= amount;
                    p.save();
                    return msg.channel.send(`success! you now have ${p.coin}$ in your wallet.`);
                }
            }
        }
    });
}
exports.default = load;
//# sourceMappingURL=economy.js.map