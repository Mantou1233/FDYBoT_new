import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import { craft } from "../assets/data";
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "craft",
        category: "Currency",
        desc: "Craft items",
        flags: ["-r", "-p"],
        handler: async (msg, {prefix}) => {
            let args = ap(msg.content, true);
            let p = new Profile(msg.author.id) as UserSchema;
            if(!args[1]) return;

            let item = im.getItems(args[1], Object.keys(craft));
            if(!item) return msg.channel.send(i18n.parse(msg.lang, "currency.format.subjectNotFoundOrUsable"));
            if(!p.inv[item]) return msg.channel.send(i18n.parse(msg.lang, "currency.format.subjectDontHave"));
            p.save();
        }
    });
}

export default load;

