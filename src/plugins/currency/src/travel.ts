import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import callers from "../assets/handlers";
import queue from "./queue";
import ms from "pretty-ms";

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
            if(!args[1]) return;
            
            queue.tripQueue.push({
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: 30,
                lootOverride: {
                    sussy: 1,
                    aaaa: 1,
                    fish: 114514
                }
            });

            msg.reply(`duck is now travling in ${args[1]}`);
        }
    });
}


export default load;