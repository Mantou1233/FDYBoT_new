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
            const current = queue.tripQueue[msg.author.id];
            if(current) return msg.channel.send(`Your duck is already on travel! (${toPercent(current.lapse - current.time, current.lapse)})`);
            if(!args[1]) return msg.channel.send("invaild location! use `+map` to see a list of maps.");
            if(!Object.keys(locations).includes(args[1])) return msg.channel.send("that is not a vaild place.");
            
            queue.tripQueue[msg.author.id] = {
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: locations[args[1]].time,
                lapse: locations[args[1]].time,
                flow: 0
            };

            msg.reply(`duck is now travling in ${args[1]}`);
        }
    });
    cm.register({
        command: "map",
        category: "Currency",
        desc: "see le map",
        handler: async (msg, { prefix }) => {
            msg.channel.send(`Current locations: ${1}\n${i18n.parse(msg.lang, "currency.format.result", "Plains", "Great place for you dumb ass to touch grass")} `);
        }
    });
}


export default load;