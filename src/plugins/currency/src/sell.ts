import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import { fishing } from "../assets/loots.json";
const loot = fishing;
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "sell",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, {prefix}) => {
            let p = new Profile(msg.author.id) as UserSchema;

        }
    });
}

export default load;

