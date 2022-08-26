"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./services/i18n");
require("./services/random");
require("./services/ap");
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = __importDefault(require("discord.js"));
const PluginLoader_1 = __importDefault(require("./core/PluginLoader"));
const CommandHandler_1 = __importDefault(require("./core/CommandHandler"));
console.log("Starting miraicle...");
const { GatewayIntentBits, Partials } = discord_js_1.default;
dotenv_1.default.config();
async function main() {
    // Legacy DiscordJS Client
    const client = new discord_js_1.default.Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
        allowedMentions: {
            parse: ["everyone", "roles", "users"],
            repliedUser: false
        }
    });
    client.once("ready", async () => {
        console.log(`[miraicle] DiscordJS logged in as ${client.user?.tag}!`);
        await botMain(client);
    });
    client.on("messageCreate", async (msg) => {
        await (0, CommandHandler_1.default)(client, msg);
    });
    client.login(process.env.TOKEN).then(r => { });
}
main();
//Main Function
async function botMain(client) {
    try {
        // Load Plugins
        const loader = new PluginLoader_1.default(client);
        client.loader = loader;
        await loader.load();
        console.log("-> miraicle has started!");
        console.log(`-> watching ${client.guilds.cache.size} Servers, ${client.channels.cache.size} channels & ${client.guilds.cache.reduce((users, value) => users + value.memberCount, 0)} users`);
        const botPresence = "{server} Servers | +help";
        const active = botPresence
            .replace(/{server}/g, `${client.guilds.cache.size}`)
            .replace(/{channels}/g, `${client.channels.cache.size}`)
            .replace(/{users}/g, `${client.guilds.cache.reduce((users, value) => users + value.memberCount, 0)}`);
        const botType = "WATCHING";
        client.user.setPresence({
            activities: [{ name: active, type: botType }]
        });
    }
    catch (e) {
        console.error("Failed to start miraicle:");
        console.error(e);
        process.exit(1);
    }
}
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    // Application specific logging, throwing an error, or other logic here
});
process.on("uncaughtException", (err, origin) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map