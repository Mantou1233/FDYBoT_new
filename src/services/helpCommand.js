const ux = (name, value, inline) => {return {name, value, inline}}
const Discord = require("discord.js");
const helpMessage = async (msg, { prefix, _ }, ccm) => {
    ccm = [...ccm.values()];
    const args = ap(msg.content);
    if (!args[1]) {
        let keys = [];
        for (let command of ccm) {
            keys.push(command.command);
        }
        let categoryLists = [];
        await _.forEach(ccm, c => {
            if (c?.disabled || c?.hidden) return;
            if ("category" in c) {
                if (c.category in categoryLists) {
                    categoryLists[c.category] +=
                        ", `" + prefix + c.command + "`";
                } else {
                    categoryLists[c.category] = "`" + prefix + c.command + "`";
                }
            } else {
                if ("Uncategorized" in categoryLists) {
                    categoryLists["Uncategorized"] +=
                        ", `" + prefix + c.command + "`";
                } else {
                    categoryLists["Uncategorized"] = prefix + c.command;
                }
            }
        });

        const newEmbed = new Discord.EmbedBuilder()
            .setColor("#CFF2FF")
            .setTitle("fdybot help menu")
            .setDescription(
                "do `$h module` to see a description of a command you need more info on! For example `/h jrrp`"
            );
        for(let [key, value] of Object.entries(categoryLists)){
            newEmbed.addFields(ux("**" + key + "**", value));
        }

        return msg.channel.send({ embeds: [newEmbed] });
    } else {
        const command = ccm.find(
            a => ((a.alias ?? []).includes(args[1])) || a.command === args[1]
        );
        if (command === undefined) return msg.channel.send({ embeds: [
            new Discord.EmbedBuilder()
            .setColor("#B33A3A")
            .setDescription(
                `I can\'t find that command. Please verify that the command exists before trying again.`
            )
        ] });;
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
            let titleText = ``;
            var name = command?.command;
            var usage = command?.usage
                ? command?.usage
                : "`" + prefix + name + "`";
            usage = usage.replace(/%p/g, prefix).replace(/{prefix}/g, prefix);
            var desc = command?.desc;
            var alias = command?.alias ? command?.alias : [];
            if (alias === []) {
                titleText = `\`${prefix}${name}\``;
            } else {
                titleText = `\`${prefix}${name}\``;
                for (let e of alias) {
                    titleText += ` **/** \`${prefix}`;
                    titleText += e;
                    titleText += "`";
                }
            }
            const newEmbed = new Discord.EmbedBuilder()
                .setColor("#CFF2FF")
                .setTitle(titleText)
                .setDescription(`${desc}`)
                .addFields({ name: "Usage", value: `${usage}`, inline: true });
            msg.channel.send({ embeds: [newEmbed] });
        
    }
};
module.exports = helpMessage;
