import { Message, ClientEvents } from "discord.js";
import { langs } from "./../../services/i18n";
import { Awaitable, Copy } from "../Utils";
import { PluginLike } from "./Plugin";

type snowflake = string;
export interface Command {
    display?: string; 
    command: string; 
    force?: boolean;
    desc?: string;
    usage?: string;
    cooldown?: number; 
    category?: string;
    alias?: string[];
    alias2?: string[];
    disabled?: boolean;
    hidden?: boolean;
    flags?: string[],
    /** [class, method] */ from: [PluginLike, string];
}

export interface Event{
    event: string;
    desc?: string;
    hierarchy: number; 
    /** [class, method] */ from: [PluginLike, string];
}

export interface PluginInfo{
    name: string;
    desc?: string;
}

export interface PluginData{
    commands: {
        [K: string]: Command
    };
    events: {
        [K in keyof ClientEvents]: ((...args: ClientEvents[K]) => any)[]
    };
    dependencies: string[];
}

export interface PluginExtensiveData extends PluginData{
    parent: PluginLike;
}

