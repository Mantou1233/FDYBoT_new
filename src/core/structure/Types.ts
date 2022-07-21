import { Message } from 'discord.js';

interface Command {
    display?: string; //display in help command
    command: string; //command name
    force?: boolean;
    desc?: string;
    usage?: string;
    cooldown?: number;
    category?: string;
    alias2?: string[]; 
    alias?: string[];
    disabled?: boolean;
    hidden?: boolean;
    pass?: boolean;
    flags?: string[];
    from?: string;
    override?: {cooldown: {}, error: {}}; //user override
    handler: (message: Message, ext: any) => any;
}


interface Runner {
    name: string;
    disabled?: boolean;
    handler: (message: Message) => any;
}

export type { Command, Message, Runner };
