import CommandManager from './core/CommandManager';
import PluginLoader from './core/PluginLoader';

declare global {
    var i18n: {
        parse: (lang: any, string: string, ...opt) => string
        globe: any
    }
    var random: (min: number, max: number) => number
    var ap: (msg: string, mode?: boolean, flags?: any) => string[]
}

declare module "discord.js" {
    interface Client {
        manager: CommandManager,
        loader: PluginLoader
    }
}
export {}