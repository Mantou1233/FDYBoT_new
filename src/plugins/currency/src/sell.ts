import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
import im from "../../../services/inventory";
import { Profile } from "../../../core/Database";
import { UserSchema } from "../../../core/structure/Schema";
import { sell } from "../assets/data";
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
	cm.register({
		command: "sell",
		category: "Currency",
		desc: "See what do you got in your inventory",
		handler: async (msg, {prefix}) => {
			const args = ap(msg.content, true);
			let p = new Profile(msg.author.id) as UserSchema;

			let result = {};
			let price = 0;
			
			if(args[1] == "all"){    
				for(let [i, n] of Object.entries(sell)){
					if(im.hasItem(p, i)){
						result[i] = p.inv[i];
						price += p.inv[i] * n;
						im.deleteItem(p, i);
					}continue;
				}
			}else{
				let item = im.getItems(args[1], Object.keys(sell));
				if(!item) return msg.channel.send(i18n.parse(msg.lang, "currency.format.notFoundOrUsable"));
				if(im.hasItem(p, item)){
					result[item] = p.inv[item];
					price += p.inv[item] * sell[item];
					im.deleteItem(p, item);
				}
			}

			p.coin += price;
			p.save();
			msg.channel.send(
				{
					embeds: [
						new Discord.EmbedBuilder()
							.setTitle("You sold")
							.setDescription(
								(
									function(res, str = ""){
										for(let [k, v] of Object.entries(res)){
											if((v as number) < 1) continue;
											str += i18n.parse(msg.lang, "currency.format.result", im.toDisplay(msg.lang, k, true), `${v}\n`);
										}
										return str || "nothing\n";
									} 
								)(result) + `and got ${price} duck coin`
							)
							.setColor(i18n.globe.color)
					]
				}
			);
		}
	});
}

export default load;

