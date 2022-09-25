import { PluginDataSymbol, PluginExtensiveSymbol, PluginInfoSymbol } from "./../../services/constants";
import { PluginData, PluginExtensiveData, PluginInfo } from "./Types";

export interface PluginLike{
    [PluginInfoSymbol]: PluginInfo;
    [PluginDataSymbol]: PluginData;
}

export class PluginBase implements PluginLike{
    [PluginInfoSymbol]: PluginInfo;
    [PluginDataSymbol]: PluginData;
}

export class ExtendedPluginBase extends PluginBase{
    [PluginInfoSymbol]: PluginInfo;
    [PluginDataSymbol]: PluginData;
    [PluginExtensiveSymbol]: PluginExtensiveData;
}


export class PluginManager<T = any>{

}