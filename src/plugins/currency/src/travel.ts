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
            if(current) return msg.channel.send(i18n.parse(msg.lang, "trip.travel.or", toPercent(current.lapse - current.time, current.lapse)));
            if(!args[1]) return msg.channel.send(i18n.parse(msg.lang, "trip.travel.invaild", prefix));
            if(!Object.keys(locations).includes(args[1])) return msg.channel.send(i18n.parse(msg.lang, "trip.travel.invaild", prefix));
            
            queue.tripQueue[msg.author.id] = {
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: locations[args[1]].time,
                lapse: locations[args[1]].time,
                flow: 0,
                lang: msg.lang
            };

            msg.reply(`duck travelin  ${args[1]} ok`);
        }
    });
    cm.register({
        command: "map",
        category: "Currency",
        desc: "see le map",
        handler: async (msg, { prefix }) => {
            msg.channel.send(`Current locations: ${1}\n${i18n.parse(msg.lang, "currency.format.result", "Plains", "Great place for you dumb ass to touch grass")}\n${i18n.parse(msg.lang, "currency.format.result", "setUncaughtExceptionCaptureCallbackSuperiorRandomTypingPlaceBecauseIAmLazy", "tf?")} `);
        }
    });
}


export default load;