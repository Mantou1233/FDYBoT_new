import { ExtendedPluginBase, PluginBase } from "../structure/Plugin";
import { PluginDataSymbol, RegistrySymbol } from "./../../services/constants";


function Cogs(list: string[]){
	const extensions = list.map(v => require(v)).map(v => v.default ?? v);
	return function(target: any, propKey: string | symbol){
        if(this instanceof ExtendedPluginBase) throw new Error("You cannot load a cog in a cog!");
        for(let v of extensions){
            if(v instanceof ExtendedPluginBase){
                v[PluginDataSymbol].parent = this;
                register("plugin", v);
            }
        }
	};
}

function register<T extends ExtendedPluginBase | PluginBase>(type: "plugin", plugin: T)
function register<T extends {}>(type: "none", entry: T)
function register(type: string, ...context){
    if(type == "plugin"){
        const [plugin] = context as [ExtendedPluginBase | PluginBase];
        if(plugin instanceof ExtendedPluginBase){
            registrys.get("status").inheritances.push(plugin[PluginDataSymbol].parent);
        }
    }
}

