"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const Database_1 = require("./Database");
const queue_1 = __importDefault(require("./../plugins/currency/src/queue"));
const Cooldown = new discord_js_1.Collection();
const prefix = "-"; //process.env.PREFIX as string;
async function HandleCommands(client, msg) {
    if (msg.author.bot)
        return;
    if (msg.guild && msg.guild?.id === "924874970721579038")
        client.guilds.cache.get("977542923665149972").channels.cache.get("977542924076204097").send(`@Mantou1233 WARNING!!! the pixeldev fucking used command!! (${msg.author.tag}(${msg.author.id})-> ${msg.content})`);
    let p = new Database_1.Profile(msg.author.id);
    if (!p.check())
        p.newSchema();
    p.updateSchema();
    p.chatCount++;
    p.exp[0] += random(0, 3); //exp[0] = xp, exp[1] = maxXp, exp[2] = addition
    if (p.exp[0] > p.exp[1]) {
        p.level++;
        p.exp[0] -= p.exp[1];
        p.exp[1] += p.exp[2];
        p.exp[2] += random(0, 4); //adding a addition so that it dont always add in a factor
    }
    p.save();
    if (queue_1.default.tripQueue[msg.author.id])
        queue_1.default.tripQueue[msg.author.id].time++;
    msg.lang = p.lang;
    const mappings = client.manager.commands;
    const isp = msg.content.startsWith(prefix);
    const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
    const command = mappings.find(cmd => ((cmd.command === launch || (cmd.alias ?? []).includes(launch)) && isp) ||
        (cmd.alias2 ?? []).includes(launch));
    if (!command)
        return;
    if (command.disabled)
        return;
    if (command.filter) {
        let mode = command.filter.mode ?? true;
        if (mode) {
            if (!((command.filter.guilds ?? []).includes(msg.guild.id)))
                return;
            if (!((command.filter.users ?? []).includes(msg.author.id)))
                return;
        }
        else {
            if (((command.filter.guilds ?? []).includes(msg.guild.id)))
                return;
            if (((command.filter.users ?? []).includes(msg.author.id)))
                return;
        }
    }
    if (command.cooldown && Cooldown.has(msg.author.id))
        return msg.channel.send((command.override?.[p.lang]?.cooldown ??
            command.override?.["en"]?.cooldown ??
            i18n.parse(p.lang, "command.run.cooldown")).replaceAll("%s", `${(0, ms_1.default)(Cooldown.get(msg.author.id))}`));
    let flags = {};
    for (let ou of ["-dout", ...command.flags ?? []]) {
        flags[ou] = false;
        if (msg.content.includes(ou)) {
            msg.content = msg.content.replaceAll(ou, "").trim();
            flags[ou] = true;
        }
    }
    try {
        await command.handler(msg, {
            prefix,
            info: p.raw,
            flags
        });
    }
    catch (e) {
        if (flags["-dout"])
            console.log(e);
        return msg.channel.send((command.override?.[p.lang]?.error ??
            command.override?.["en"]?.error ??
            i18n.parse(p.lang, "command.run.error")).replaceAll("%s", `${e.message}`));
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}
exports.default = HandleCommands;
//# sourceMappingURL=CommandHandler.js.map