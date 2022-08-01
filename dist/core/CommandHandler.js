"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const Database_1 = require("./Database");
const Cooldown = new discord_js_1.Collection();
const prefix = "+";
async function HandleCommands(client, msg) {
    if (msg.author.bot)
        return;
    let p = new Database_1.Profile(msg.author.id);
    if (!p.check())
        p.newSchema();
    p.chatCount++;
    p.exp[0] += random(0, 3); //exp[0] = xp, exp[1] = maxXp, exp[2] = addition
    if (p.exp[0] > p.exp[1]) {
        p.level++;
        p.exp[0] -= p.exp[1];
        p.exp[1] += p.exp[2];
        p.exp[2] += random(0, 4); //adding a addition so that it dont always add in a factor
    }
    p.save();
    msg.lang = p.lang;
    const mappings = client.manager.commands;
    let ou = false;
    if (msg.content.includes("--dout")) {
        msg.content = msg.content.replaceAll("--dout", "");
        ou = true;
    }
    if (client.manager.beforeChat.length > 0)
        await client.manager.runBeforeChatEvents(msg);
    const isp = msg.content.startsWith(prefix);
    const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
    const command = mappings.find(cmd => ((cmd.command === launch || (cmd.alias ?? []).includes(launch)) && isp) ||
        (cmd.alias2 ?? []).includes(launch));
    if (!command)
        return;
    if (command.disabled)
        return;
    if (command.cooldown && Cooldown.has(msg.author.id))
        return msg.channel.send((command.override?.cooldown?.[p.lang] ??
            command.override?.cooldown?.["en"] ??
            i18n.parse(p.lang, "command.run.cooldown")).replaceAll("%s", `${(0, ms_1.default)(Cooldown.get(msg.author.id))}`));
    try {
        await command.handler(msg, { prefix });
    }
    catch (e) {
        if (ou)
            console.log(e);
        return msg.channel.send((command.override?.error?.[p.lang] ??
            command.override?.error?.["en"] ??
            i18n.parse(p.lang, "command.run.error")).replaceAll("%s", `${e.message}`));
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}
exports.default = HandleCommands;
//# sourceMappingURL=CommandHandler.js.map