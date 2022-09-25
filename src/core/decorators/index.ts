import { PluginInfoSymbol } from "../../services/constants";
import { PluginBase } from "../structure/Plugin";

function Inject(target: any, propKey: string | symbol){
	switch(propKey){
		case "client": {
			target.client = 0;//client
		}
	}
}

function Cogs(list: string[]){
	const extensions = list.map(v => require(v));
	return function(target: any, propKey: string | symbol){
		
	};
}

function Command(a) {
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
        target[PluginInfoSymbol].commands.push(propKey);
    };
}