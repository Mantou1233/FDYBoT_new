// A decorator function which replicates the mixin pattern:
import { Client } from "discord.js";
const DefinePlugin = (target) => {
	return class Plugin extends target {};
};
declare module "discord.js" {
	interface Client{
		manager: any,
		loader: any
	}
}

const client = new Client({
	intents: []
});
function Command() {
	console.log("first(): factory evaluated");
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		console.log("first(): called");
	};
}

class IPlugin {
	[key: string]: any;
	private client: Client;
	init(client: Client): any{
		throw new Error();
	}
}

@DefinePlugin
class NewPlugin extends IPlugin{
	@Command()
	async PingCommand(msg, ext){
		msg.reply("test");
	}

	init(client: Client){
		client.manager.regsiter(this.PingCommand);
	}
}

client.loader.register(new NewPlugin);