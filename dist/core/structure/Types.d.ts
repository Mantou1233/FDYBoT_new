import { Message } from "discord.js";
import { langs } from "./../../services/i18n";
import { Awaitable, Copy } from "../Utils";
type OverrideLangString<T> = {
    [key in keyof typeof langs]?: T;
};
type snowflake = string;
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
    flags?: string[];
    from?: string;
    filter?: {
        /** @description true = whitelist, false = blacklist*/
        mode?: boolean;
        guilds?: snowflake[];
        users?: snowflake[];
    };
    override?: OverrideLangString<Copy<Exclude<Command & {
        error?: string;
        cooldown?: string;
    }, "override">>>;
    handler: (message: Message, ext: any) => Awaitable<void | any>;
}
interface Runner {
    name: string;
    disabled?: boolean;
    handler: (message: Message) => any;
}
export type { Command, Message, Runner };
