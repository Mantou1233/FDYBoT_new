import CommandManager from '../../../core/CommandManager';
import { progressBar, toPercent, toSizing } from '../../../services/math';
import Discord from 'discord.js';
import { Profile } from './../../../core/Database';
import { langs } from './../../../services/i18n';

/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "balance",
        category: "Currency",
        desc: "Get how many money you got!",
        alias: ["bal"],
        handler: async msg => {
            let p = new Profile(msg.author.id)

            const percent = toPercent(p.bank, p.bankAmount);
            const bar = progressBar(toSizing(p.bank, p.bankAmount), 100, 10);

            const embed = new Discord.EmbedBuilder()
                .setColor("#CFF2FF")
                .setTitle(`${p.name}'s profile`)
                .setDescription(
                    `Wallet: ${p.coin}\nBank: ${p.bank} / ${p.bankAmount} (${bar}${percent})`
                );

            msg.channel.send({ embeds: [embed] });
        }
    });
    cm.register({
        command: "uwu",
        category: "Currency",
        desc: "Get how many money you got!",
        alias: ["bal"],
        handler: async msg => {
            let args = ap(msg.content);
            let p = new Profile(msg.author.id)

            msg.channel.send(`seethe to ${args.join(", ")}`);
            if(args.length == 1 || !Object.keys(langs).includes(args[1])) return;
            p.lang = args[1]
            msg.channel.send(`seethe to ${args[1]}`);
        }
    });
    cm.register({
        command: "err",
        category: "Currency",
        desc: "Get how many money you got!",
        handler: async msg => {
            throw new Error("test")
        }
    });
}

module.exports = load;
