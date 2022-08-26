import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import queue from "./queue";
const loots = {

};

/**
 * @returns void
 */
async function load(client: Discord.Client, cm: CommandManager) {
	setInterval(() => {
		let index = 0;
		for(let q of queue.tripQueue){
			q.time -= 1;
			if(q.time == 0){
				const p = new Profile(q.id) as UserSchema;
				let result = {};
				for(let [k, v] of (Object.entries(Object.assign({}, loots[q.location] ?? {}, q.lootOverride ?? {})))){
					result[k] = random(0, v as number);
					im.addItem(p, k, result[k]);
				}
				q.channel.send(
					{
						content: `<@${q.id}>`,
						embeds: [
							new Discord.EmbedBuilder()
								.setTitle(`you traveled at ${q.location} and got `)
								.setDescription(
									(
										function(res, str = ""){
											for(let [k, v] of Object.entries(res)){
												if((v as number) < 1) continue;
												str += i18n.parse("en", "currency.format.result", im.toDisplay("en", k, true), `${v}\n`);
											}
											return str;
										}
									)(result)
								)
								.setColor(i18n.globe.color)
						]
					}
				);
				queue.tripQueue.splice(index, 1);
				p.save();
				continue;
			}
			if(random(0, 100) > 98 && q.time % 2 == 0){
				q.channel.send(
					{
						content: `<@${q.id}>`,
						embeds: [
							new Discord.EmbedBuilder()
								.setTitle("lmao")
								.setDescription("ur duck fucking dead because imposter killed ur duck")
								.setColor(i18n.globe.color)
						]
					}
				);
				queue.tripQueue.splice(index, 1);
			}
			index++;
		}
	}, 1000);
	
	// cm.register({
	//     command: "stats",
	//     category: "Basic",
	//     desc: "Display information saved from you",
	//     handler: async (msg, { prefix }) => {
	//         let p = new Profile(msg.author.id) as UserSchema;

	//         msg.channel.send(
	//             `You chatted ${p.chatCount} times! \nLevel ${p.level}, ${p.exp[0]} / ${p.exp[1]}\nCurrently equipped ${p.equip.rod !== -1? im.toDisplay(msg.lang, p.equip.rod) : "no fishing rod"}`
	//         );
	//     }
	// });
}

export default load;