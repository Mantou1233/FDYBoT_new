import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import callers from "../assets/handlers";
import queue from "./queue";
import { locations } from "../assets/data";
import ms from "pretty-ms";
import { toPercent } from "../../../services/math";

/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "travel",
        category: "Currency",
        desc: "go travel",
        handler: async (msg, { prefix }) => {
            let args = ap(msg.content, true);
            let p = new Profile(msg.author.id) as UserSchema;
            const current = queue.tripQueue.find((v) => v.id == msg.author.id);
            if(current) return msg.channel.send(`Your duck is already on travel! (${toPercent(current.otime - current.time, current.otime)})`);
            if(!args[1]) return msg.channel.send("invaild location! type `+map` to see a list of maps.");
            if(!Object.keys(locations).includes(args[1])) return msg.channel.send("that is not a vaild place.");
            
            queue.tripQueue.push({
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: locations[args[1]].time,
                otime: locations[args[1]].time,
            });

            msg.reply(`duck is now travling in ${args[1]}`);
        }
    });
}


export default load;