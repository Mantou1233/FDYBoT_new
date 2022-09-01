import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import queue from "./queue";
import { locations } from "../assets/data";


/**
 * @returns void
 */
async function load(client: Discord.Client, cm: CommandManager) {

	// cm.registerBeforeChatEvent({
	// 	"name": "trip",
	// 	handler: async (msg) => {
	// 		if(queue.tripQueue[msg.author.id]) queue.tripQueue[msg.author.id].time -= random(1, 2);
	// 	}
	// });
	setInterval(() => {
		for(let [k, q] of Object.entries(queue.tripQueue)){
			q.time -= 1;
			if(q.time <= 0){
				const p = new Profile(q.id) as UserSchema;
				let result = {};
				for(let [k, v] of (Object.entries(Object.assign({}, locations[q.location].loots ?? {}, q.lootOverride ?? {})))){
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
												str += i18n.parse("en", "currency.format.result", im.toDisplay("en", k, false), `${v}\n`);
											}
											return str;
										}
									)(result)
								)
								.setColor(i18n.globe.color)
						]
					}
				);
				delete queue.tripQueue[k];
				p.save();
				continue;
			}
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