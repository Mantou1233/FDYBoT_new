import { PluginInfoSymbol } from "../../services/constants";
import { PluginBase } from "../structure/Plugin";




export function Inject(target: any, propKey: string | symbol){
    if(!target[PluginInfoSymbol]) {
        target[PluginInfoSymbol] = {
            info: {

            },
            commands: [],
            events: []
        };
    }
    if(propKey == "client"){
        target.client = 1;
    }
}

export function Cogs(a: string[]){
	return function(target: any, propKey: string | symbol){
		if(!target[PluginInfoSymbol]) {
			target[PluginInfoSymbol] = {
				info: {
	
				},
				commands: [],
				events: []
			};
		}
		if(propKey == "client"){
			target.client = 1;
		}
	};
}

export function Command(a) {
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
        target[PluginInfoSymbol].commands.push(propKey);
    };
}
