import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "stats",
        category: "Basic",
        desc: "Display information saved from you",
        handler: async (msg, { prefix }) => {
            let p = new Profile(msg.author.id) as UserSchema;

            msg.channel.send(
                `You chatted ${p.chatCount} times! \nLevel ${p.level}, ${p.exp[0]} / ${p.exp[1]}\nCurrently equipped ${p.equip.rod !== -1? im.toDisplay(msg.lang, p.equip.rod) : "no fishing rod"}`
            );
        }
    });
    cm.register({
        command: "inventory",
        category: "Currency",
        desc: "See what do you got in your inventory",
        alias: ["inv"],
        handler: async msg => {
            let id = msg.author.id;
            let p = new Profile(`${id}`) as UserSchema;

            let text = "";
            for (let [item, count] of Object.entries(p.inv)) {
                if (count === 0) {
                    delete p.inv[item];
                    continue;
                }
                text += `${im.toDisplay(msg.lang, item) + " ─ " + count}\n`;
            }
            p.save();
            const embed = new Discord.EmbedBuilder()
                .setColor(i18n.globe.color)
                .setTitle(`${msg.author.username}'s inventory`)
                .addFields({name: "Equipment", value: `currently equipped ${p.equip.rod == -1 ? "nothing" : im.toDisplay(msg.lang, p.equip.rod) + " as fishing rod"}`, inline: true})
                .addFields({name: "Inventory", value: text, inline: true});

            msg.channel.send({ embeds: [embed] });
        }
    });
}

export default load;