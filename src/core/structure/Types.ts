import { Message } from 'discord.js';
import { langs } from './../../services/i18n';
type OverrideLangString<T> = {
    [key in keyof typeof langs]?: T
}
interface Command {
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
    from?: string;
    override?: {
        cooldown?: OverrideLangString<string>,
        error?: OverrideLangString<string>
    }; 
    handler: (message: Message, ext: any) => Awaitable<void | any>;
}


interface Runner {
    name: string;
    disabled?: boolean;
    handler: (message: Message) => any;
}

type Awaitable<T> = T | PromiseLike<T>

export type { Command, Message, Runner };
