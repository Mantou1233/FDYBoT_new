import "reflect-metadata";
import "./services/i18n";
import "./services/random";
import "./services/ap";
import dotenv from "dotenv";
import Discord from "discord.js";
import PluginLoader from "./core/PluginLoader";
import CommandHandler from "./core/CommandHandler";
console.log("Starting miraicle...");

const { GatewayIntentBits, Partials } = Discord;
dotenv.config();

async function main() {
    // Legacy DiscordJS Client
    const client = new Discord.Client({
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

    client.on("messageCreate", async msg => {
        await CommandHandler(client, msg);
    });

    client.login(process.env.TOKEN).then(r => {});
}

main();
//Main Function
async function botMain(client) {
    try {
        // Load Plugins

        const loader = new PluginLoader(client);


        client.loader = loader;
        await loader.load();

        console.log("-> miraicle has started!");
        console.log(
            `-> watching ${client.guilds.cache.size} Servers, ${
                client.channels.cache.size
            } channels & ${client.guilds.cache.reduce(
                (users, value) => users + value.memberCount,
                0
            )} users`
        );
        const botPresence = "{server} Servers | +help";

        const active = botPresence
            .replace(/{server}/g, `${client.guilds.cache.size}`)
            .replace(/{channels}/g, `${client.channels.cache.size}`)
            .replace(
                /{users}/g,
                `${client.guilds.cache.reduce(
                    (users, value) => users + value.memberCount,
                    0
                )}`
            );

        const botType = "WATCHING";

        client.user.setPresence({
            activities: [{ name: active, type: botType }]
        });
    } catch (e) {
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
