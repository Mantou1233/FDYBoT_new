import CommandManager from './core/CommandManager';
import PluginLoader from './core/PluginLoader';
import { langTypes, langs } from './services/i18n';
const {en} = langs

declare global {
    var i18n: {
        parse: (lang: string, string: keyof typeof en | `-${string}`, ...opt) => string
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
    interface Message{
        lang: langTypes
    }
}
export {}