import { Collection, Client } from "discord.js";
import type { Command, Runner } from "./structure/Types";
class CommandManager {
    client: Client;
    commands: Collection<string, Command>;
    beforeChat: Array<Runner>;

    constructor(client) {
        this.client = client
        this.commands = new Collection();
        this.beforeChat = [];
    }

    register(cmd: Command) {
        if (this.commands.get(cmd.command) !== undefined)
            throw new Error("Naming conflict!");
        this.commands.set(cmd.command, {
            disabled: false,
            hidden: false,
            from: global.loading as string,
            category: "Basic",
            desc: "",
            usage: `%p${cmd.command}`,
            ...cmd
        });
    }

    registerBeforeChatEvent(runner: Runner) { // TODO redo rbce,,, the runner is too much of a quick implelment
        this.beforeChat.push({disabled: false, ...runner});
    }

    async runBeforeChatEvents(msg) {
        for (const { disabled, handler } of this.beforeChat) {
            if(disabled) continue;
            try {
                await handler(msg);
            } catch (e) {
                return msg.channel.send(`Oops, a error appeared: ${e.message}`)
            }
        }
    }
}

export default CommandManager;
