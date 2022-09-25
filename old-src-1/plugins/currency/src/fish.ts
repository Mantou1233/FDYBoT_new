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
        command: "fish",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, {prefix}) => {
            let p = new Profile(msg.author.id) as UserSchema;

            if(p.equip.rod === -1) return msg.channel.send(i18n.parse(msg.lang, "currency.fish.noRod", prefix, prefix));
            if(!loot[p.equip.rod]) throw new Error("Your fishing rod equipped dont have any loot. try to unequip it");

            let result = {};
            for(let [k, v] of (Object.entries(loot[p.equip.rod]))){
                result[k] = random(0, v as number);
                im.addItem(p, k, result[k]);
            }
            msg.channel.send(
                {
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("You caught:")
                            .setDescription(
                                (
                                    function(res, str = ""){
                                        for(let [k, v] of Object.entries(res)){
                                            if((v as number) < 1) continue;
                                            str += i18n.parse(msg.lang, "currency.format.result", im.toDisplay(msg.lang, k, false), `${v}\n`);
                                        }
                                        return str;
                                    }
                                )(result)
                            )
                            .setColor(i18n.globe.color)
                    ]
                }
            );

            p.save();
        }
    });
}

export default load;

