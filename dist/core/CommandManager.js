"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommandManager {
    client;
    commands;
    constructor(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
    }
    register(cmd) {
        if (this.commands.get(cmd.command) !== undefined)
            throw new Error("Naming conflict!");
        this.commands.set(cmd.command, {
            disabled: false,
            hidden: false,
            from: global.loading,
            category: "Basic",
            desc: "",
            usage: `%p${cmd.command}`,
            ...cmd
        });
    }
}
exports.default = CommandManager;
//# sourceMappingURL=CommandManager.js.map