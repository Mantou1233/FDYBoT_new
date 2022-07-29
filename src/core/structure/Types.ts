import { Message } from 'discord.js';
import { langs } from './../../services/i18n';

type OverrideLangString<T> = {
    [key in keyof typeof langs]?: T
}
interface Command {
    display?: string; // display in help command
    command: string; // command name
    force?: boolean; // 
    desc?: string; // 
    usage?: string; // 
    cooldown?: number; //
    category?: string; //
    alias2?: string[]; 
    alias?: string[];
    disabled?: boolean;
    hidden?: boolean;
    pass?: boolean;
    flags?: string[];
    from?: string;
    override?: {
        cooldown?: OverrideLangString<string>,
        error?: OverrideLangString<string>
    }; 
    handler: (message: Message, ext: any) => any;
}


interface Runner {
    name: string;
    disabled?: boolean;
    handler: (message: Message) => any;
}

export type { Command, Message, Runner };
