import { Client, Collection, Message, Guild, TextChannel } from "discord.js";
import ms from "ms";
import { Command } from "./structure/Types";
import { Profile } from "./Database";
import Schema from "./structure/Schema";
import { langs } from "./../services/i18n";

const Cooldown = new Collection<string, number>();

const prefix = "+";

async function HandleCommands(client: Client, msg: Message) {
    if (msg.author.bot) return;
    if (msg.guild && msg.guild?.id === "924874970721579038") 
        (((client as Client).guilds.cache.get("977542923665149972") as Guild).channels.cache.get("977542924076204097") as TextChannel).send(`@Mantou1233 WARNING!!! the pixeldev fucking used command!! (${msg.author.tag}(${msg.author.id})-> ${msg.content})`);
    
    let p = new Profile(msg.author.id) as any as typeof Schema.user & Profile;
    if(!p.check()) p.newSchema();
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
    
    msg.lang = p.lang as keyof typeof langs;
    const mappings = client.manager.commands as Collection<
        string,
        Command
    >;

    let ou = false;
    if(msg.content.includes("--dout")){
        msg.content = msg.content.replaceAll("--dout", "");
        ou = true;
    }

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
            ).replaceAll("%s", `${ms(Cooldown.get(msg.author.id))}`));
    try {
        await command.handler(msg, {
            prefix,
            info: p.raw
        });
    } catch (e) {
        if(ou) console.log(e);
        return msg.channel.send(
            (
                command.override?.error?.[p.lang] ??
                command.override?.error?.["en"] ??
                i18n.parse(p.lang, "command.run.error")
            ).replaceAll("%s", `${e.message}`));
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}

export default HandleCommands;
