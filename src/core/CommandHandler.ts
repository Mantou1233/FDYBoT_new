import { Client, Collection, Message, Guild, TextChannel, GuildChannelManager} from "discord.js";
import ms from "ms";
import { Command } from "./structure/Types";
import { Profile } from "./Database";
import Schema from "./structure/Schema";
import { langs } from "./../services/i18n";
import queue from "./../plugins/currency/src/queue";

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
    if(queue.tripQueue[msg.author.id]) queue.tripQueue[msg.author.id].time++;

    msg.lang = p.lang as keyof typeof langs;
    const mappings = client.manager.commands as Collection<
        string,
        Command
    >;

    const isp = msg.content.startsWith(prefix);
    const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
    const command = mappings.find(
        cmd =>
            ((cmd.command === launch || (cmd.alias ?? []).includes(launch)) && isp) ||
            (cmd.alias2 ?? []).includes(launch)
    ) as Command;
    if (!command) return;
    if (command.disabled) return;
    if (command.filter){
        let mode = command.filter.mode ?? true;
        if(mode){
            if(!((command.filter.guilds ?? []).includes(msg!.guild!.id))) return;
            if(!((command.filter.users ?? []).includes(msg!.author!.id))) return;
        }else{
            if(((command.filter.guilds ?? []).includes(msg!.guild!.id))) return;
            if(((command.filter.users ?? []).includes(msg!.author!.id))) return;
        }
    }
    if (command.cooldown && Cooldown.has(msg.author.id))
        return msg.channel.send(
            (
                command.override?.[p.lang]?.cooldown ??
                command.override?.["en"]?.cooldown ??
                i18n.parse(p.lang, "command.run.cooldown")
            ).replaceAll("%s", `${ms(Cooldown.get(msg.author.id))}`));

    let flags = {};
    for(let ou of ["-dout", ...command.flags ?? []]){
        flags[ou] = false;
        if(msg.content.includes(ou)){
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
    } catch (e) {
        if(flags["-dout"]) console.log(e);
        return msg.channel.send(
            (
                command.override?.[p.lang]?.error ??
                command.override?.["en"]?.error ??
                i18n.parse(p.lang, "command.run.error")
            ).replaceAll("%s", `${e.message}`));
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}

export default HandleCommands;
