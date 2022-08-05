/* eslint-disable-no-var */
import icons from "../assets/icons.json";
import CommandManager from "./core/CommandManager";
import PluginLoader from "./core/PluginLoader";
import { langTypes, langKeys, langs } from "./services/i18n";

declare global {
    var i18n: {
        parse: (
            lang: string,
            string: langKeys,
            ...opt
        ) => string;
        globe: any;
        icon: typeof icons;
    };
    var random: (min: number, max: number) => number;
    var ap: (msg: string, mode?: boolean, flags?: any) => string[];
}

declare module "discord.js" {
    interface Client {
        manager: CommandManager;
        loader: PluginLoader;
    }
    interface Message {
        lang: langTypes;
    }
}
export {};
