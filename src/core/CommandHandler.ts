import { Client, Collection, Message } from "discord.js";
import ms from "ms";
import { Command } from "./structure/Types";
import { Profile } from './Database';

const Cooldown = new Collection<string, number>();

const prefix = "+";

async function HandleCommands(client, msg: Message) {
    if (msg.author.bot) return;

    let p = new Profile(msg.author.id);
    if(!p.check()) p.newSchema();

    msg.lang = p.lang
    const mappings = client.manager.commands as Collection<
        string,
        Command
    >;

    

    if (client.manager.beforeChat.length > 0)
        await client.manager.runBeforeChatEvents(msg);

    const isp = msg.content.startsWith(prefix);
    const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
    const command = mappings.find(
        cmd =>
            ((cmd.command === launch || (cmd.alias ?? []).includes(launch)) && isp) ||
            (cmd.alias2 ?? []).includes(launch)
    ) as Command;

    if (!command) return;
    if (command.disabled) return;
    if (command.cooldown && Cooldown.has(msg.author.id))
        return msg.channel.send(
            (
                command.override?.cooldown?.[p.lang] ??
                command.override?.cooldown?.["en"] ??
                i18n.parse(p.lang, "command.run.cooldown")
            ).replaceAll("%s", `${ms(Cooldown.get(msg.author.id))}`))
    try {
        await command.handler(msg, {prefix});
    } catch (e) {
        return msg.channel.send(
            (
                command.override?.error?.[p.lang] ??
                command.override?.error?.["en"] ??
                i18n.parse(p.lang, "command.run.error")
            ).replaceAll("%s", `${e.message}`))
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}

export default HandleCommands;
