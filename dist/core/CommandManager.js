"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommandManager {
    constructor(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.beforeChat = [];
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
    registerBeforeChatEvent(runner) {
        this.beforeChat.push({ disabled: false, ...runner });
    }
    async runBeforeChatEvents(msg) {
        for (const { disabled, handler } of this.beforeChat) {
            if (disabled)
                continue;
            try {
                await handler(msg);
            }
            catch (e) {
                return msg.channel.send(`Oops, a error appeared: ${e.message}`);
            }
        }
    }
}
exports.default = CommandManager;
//# sourceMappingURL=CommandManager.js.map