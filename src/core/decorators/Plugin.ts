import { PluginInfoSymbol } from "../../services/constants";
import { ExtendedPluginBase, PluginBase } from "../structure/Plugin";
import { PluginInfo } from "../structure/Types";

export function PluginMixin(typed?: 0){
	return PluginBase;
}
export function ExtensivePluginMixin(typed?: 0){
	return ExtendedPluginBase;
}

export function DefinePlugin(info: string | PluginInfo) {
    if(typeof info == "string"){
        info = {
            name: info
        };
    }
    return function <T extends { new (...args: any[]): {} }>(constructor: T){
        return class Plugin extends constructor{
            [PluginInfoSymbol] = info;
        };
    };
}