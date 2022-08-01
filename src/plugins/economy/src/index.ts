import CommandManager from '../../../core/CommandManager';
import { progressBar, toPercent, toSizing } from '../../../services/math';
import Discord from 'discord.js';
import { Profile } from './../../../core/Database';
import { langs } from './../../../services/i18n';
import inventoryManager from '../../../services/inventory';

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
        command: "inventory",
        category: "Currency",
        desc: "See what do you got in your inventory",
        alias: ["inv"],
        handler: async msg => {
            let id = msg.author.id;
            let args = ap(msg.content, true);
            let p = new Profile(`${id}`);

            let text = "";
            for (let [item, count] of p.inv.entryz()) {
                if (count === 0) {
                    delete p.inv[item];
                    continue;
                }
                text += `${inventoryManager.toDisplay(item)} ─ ${count}\n`;
            }
            p.save();
            const embed = new Discord.EmbedBuilder()
                .setColor("#CFF2FF")
                .setTitle(`${p.name}'s inventory`)
                .setDescription(text);

            msg.channel.send({ embeds: [embed] });
        }
    });
}

module.exports = load;
