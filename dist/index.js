"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./services/i18n");
require("./services/random");
require("./services/ap");
const quick_db2_1 = __importDefault(require("quick.db2"));
quick_db2_1.default.init("json.sqlite");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discord_js_1 = __importStar(require("discord.js"));
const PluginLoader_1 = __importDefault(require("./core/PluginLoader"));
const CommandHandler_1 = __importDefault(require("./core/CommandHandler"));
console.log("Starting miraicle...");
async function main() {
    // Legacy DiscordJS Client
    const client = new discord_js_1.default.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.GuildPresences,
            discord_js_1.GatewayIntentBits.GuildMessageReactions,
            discord_js_1.GatewayIntentBits.DirectMessages,
            discord_js_1.GatewayIntentBits.MessageContent
        ],
        partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User, discord_js_1.Partials.GuildMember, discord_js_1.Partials.Reaction],
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
        client.user.setPresence({
            activities: [{ name: active, type: discord_js_1.ActivityType.Watching }]
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