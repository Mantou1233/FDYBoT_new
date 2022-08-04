import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import inventoryManager from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "fish",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, {prefix}) => {
            let p = new Profile(msg.author.id) as UserSchema;

            if(p.equip.rod === -1) return msg.channel.send(i18n.parse(msg.lang, "currency.fish.noRod", prefix, prefix));
        }
    });
}

export default load;