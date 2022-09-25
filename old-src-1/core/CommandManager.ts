import { Collection, Client } from "discord.js";
import type { Command, Runner } from "./structure/Types";
class CommandManager {
    client: Client;
    commands: Collection<string, Command>;

    constructor(client) {
        this.client = client;
        this.commands = new Collection();
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
}

export default CommandManager;
