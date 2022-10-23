import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import callers from "../assets/handlers";
import { queue } from "../caching";
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
            let p = new Profile(msg.author.id) as UserSchema;
            let args = ap(msg.content, true) ?? [0, p.location];
            const current = queue[msg.author.id];
            if(current) return msg.channel.send(i18n.parse(msg.lang, "trip.travel.or", toPercent(current.lapse - current.time, current.lapse)));
            if(!args[1]) return msg.channel.send(i18n.parse(msg.lang, "trip.travel.invaild", prefix));
            if(!Object.keys(locations).includes(args[1])) return msg.channel.send(i18n.parse(msg.lang, "trip.travel.invaild", prefix));
            
            queue[msg.author.id] = {
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: locations[args[1]].time,
                lapse: locations[args[1]].time,
                flow: 0,
                lang: msg.lang
            };
            p.location = args[1] as any;
            p.save();

            msg.reply(`duck travelin  ${args[1]} ok`);
        }
    });
    cm.register({
        command: "map",
        category: "Currency",
        desc: "see le map",
        handler: async (msg, { prefix }) => {
            msg.channel.send(`Current locations: ${Object.keys(locations).length}\n${(function(){
                let txt = "";
                for(let [place, location] of Object.entries(locations)){
                    txt += i18n.parse(msg.lang, "currency.format.result", place, ms(location.time * 1000)) + "\n";
                }
                return txt;
            })()} `);
        }
    });
}


export default load;