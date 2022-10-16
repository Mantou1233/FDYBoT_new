"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const toNewFields = (name, value, inline = false) => ({ name, value, inline });
exports.default = async (client, msg, prefix) => {
    /* prettier-ignore */
    let commands = [...client.manager.commands.values()];
    const args = ap(msg.content);
    if (!args[1]) {
        let categorys = {};
        for (let c of commands) {
            if (c?.disabled || c?.hidden)
                continue;
            if ("category" in c) {
                if (c.category in categorys) {
                    categorys[c.category] += `, \`${prefix}${c.command}\``;
                    continue;
                }
                categorys[c.category] = "`" + prefix + c.command + "`";
            }
        }
        const newEmbed = new discord_js_1.default.EmbedBuilder()
            .setColor("#CFF2FF")
            .setTitle("fdybot help menu")
            .setDescription("do `$h module` to see a description of a command you need more info on! For example `/h jrrp`");
        for (let [key, value] of Object.entries(categorys)) {
            newEmbed.addFields(toNewFields(`**${key}**`, value));
        }
        return msg.channel.send({ embeds: [newEmbed] });
    }
    else {
        const command = commands.find(a => (a.alias ?? []).includes(args[1]) || a.command === args[1]);
        if (command === undefined)
            return msg.channel.send({
                embeds: [
                    new discord_js_1.default.EmbedBuilder()
                        .setColor("#B33A3A")
                        .setDescription("I can't find that command. Please verify that the command exists before trying again.")
                ]
            });
        /*
        args[0] = 'help'
        var path = `../../commands/${args[0]}.js`;
        //
        try{
            require(`../commands/${args[0]}`)
        }catch (err){
            exists = 0
        }
        ///
        fs.access(path, (err) => {
            if (!err) {
              exists = 1
              return;
            }
        })*/
        let title = "";
        let name = command?.command;
        let usage = command?.usage ? command?.usage : "`" + prefix + name + "`";
        usage = usage.replace(/%p/g, prefix).replace(/{prefix}/g, prefix);
        let desc = command?.desc;
        let alias = command?.alias ? command?.alias : [];
        if (alias.length == 0) {
            title = `\`${prefix}${name}\``;
        }
        else {
            title = `\`${prefix}${name}\``;
            for (let e of alias) {
                title += ` **/** \`${prefix}`;
                title += e;
                title += "`";
            }
        }
        const newEmbed = new discord_js_1.default.EmbedBuilder()
            .setColor(i18n.globe.color)
            .setTitle(title)
            .setDescription(`${desc}`)
            .addFields({ name: "Usage", value: `${usage}`, inline: true });
        msg.channel.send({ embeds: [newEmbed] });
    }
};
//# sourceMappingURL=help.js.map