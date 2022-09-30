import { PluginDataSymbol } from "../../services/constants";
import { PluginBase } from "../structure/Plugin";



function Command(a) {
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
        target[PluginDataSymbol].commands.push(propKey);
    };
}