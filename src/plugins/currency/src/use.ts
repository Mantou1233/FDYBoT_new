import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import callers from "../assets/handlers";
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "use",
        category: "Currency",
        desc: "Use or open a item.",
        alias: ["open"],
        handler: async (msg, { prefix }) => {
            let args = ap(msg.content, true);
            let p = new Profile(msg.author.id) as UserSchema;
            if(!args[1]) return;

            let item = im.getItems(args[1], Object.keys(callers.use));
            if(!item) return msg.channel.send(i18n.parse(msg.lang, "currency.format.notFoundOrUsable"));
            if(!p.inv[item]) return msg.channel.send(i18n.parse(msg.lang, "currency.format.noItemFail"));

            await callers.use[item](msg, p);
        }
    });
    cm.register({
        command: "equip",
        category: "Currency",
        desc: "equip a item",
        handler: async (msg, { prefix }) => {
            let args = ap(msg.content, true);
            let p = new Profile(msg.author.id) as UserSchema;
            if(!args[1]) return;

            let item = im.getItems(args[1], Object.keys(callers.equip));
            if(!item) return msg.channel.send(i18n.parse(msg.lang, "currency.format.notFoundOrUsable"));
            if(!p.inv[item]) return msg.channel.send(i18n.parse(msg.lang, "currency.format.noItemFail"));

            if(p.equip.rod !== -1) return msg.channel.send(i18n.parse(msg.lang, "currency.equip.conflict", prefix));
            await callers.equip[item].add(msg, p);
        }
    });
    cm.register({
        command: "unequip",
        category: "Currency",
        desc: "unequip a item",
        handler: async (msg, { prefix }) => {
            let p = new Profile(msg.author.id) as UserSchema;
            
            if(p.equip.rod == -1) return msg.channel.send(i18n.parse(msg.lang, "currency.unequip.conflict"));
            if(!callers.equip[p.equip.rod]?.remove) throw new Error("Handler not found.");
            await callers.equip[p.equip.rod].remove(msg, p);
        }
    });
}

export default load;