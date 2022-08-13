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
/*
 DISCLAMER:
 the modules are made for self-check suspended issues and specified API-test modules for a *specified* server.
 for learning purpose only!
 */
const flags_json_1 = __importDefault(require("../../../assets/flags.json"));
const Discord = __importStar(require("discord.js"));
const Self = __importStar(require("discord.js-selfbot-v13"));
const snowflake = __importStar(require("../../../services/snowflake"));
const admins = ["842757573709922314", "611118369474740244"];
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "check",
        category: "API",
        hidden: true,
        handler: async (msg) => {
            const args = ap(msg.content, true);
            if (!args[1])
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(msg.lang, "command.run.invaild"),
                            color: i18n.globe["color"]
                        }
                    ]
                });
            if (!args[1].includes("."))
                return msg.channel.send("stop fucking give me random text to login you dont even have a dot in your token you retard");
            let self = new Self.Client({
                checkUpdate: false
            });
            try {
                const stat = (await (async function () {
                    await self.login(args[1]);
                    return self;
                })());
                msg.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Token is fucking ok")
                            .setDescription(`\`\`\`yml\n${stat.user.tag}\n[${stat.user?.id}]\nAccount Created at ${snowflake.convertSnowflakeToDate(stat.user?.id ?? snowflake.DISCORD_EPOCH).toUTCString()}\n\`\`\``)
                            .addFields({
                            name: "RelationShips",
                            value: (function () {
                                let amount = 0, og = 0, going = 0;
                                stat.relationships.cache.each((v, k) => {
                                    if (v == 1)
                                        amount++;
                                    if (v == 3 || v == 4)
                                        going++;
                                    let user = stat.users.cache.get(k);
                                    if (!user)
                                        return;
                                    if (user.partial)
                                        return;
                                    amount++;
                                    let flag = checkFlags(user.flags?.bitfield ?? 0, true);
                                    if (flag == "NONE")
                                        return;
                                    og++;
                                });
                                return `friends: ${amount} (outgoing / incoming request ${going})\n${og ? `${og} mutual HQ relationship` : "No mutual HQ relationship"}`;
                            })()
                        })
                            .addFields({
                            name: "Flags",
                            value: checkFlags(stat.user?.flags, false)
                        })
                            .addFields({
                            name: "Info",
                            value: `email: ${stat.user?.emailAddress}\nphone: ${stat.user?.phoneNumber}\nverified: ${stat.user?.verified}\nmfa: ${stat.user?.mfaEnabled}\nbio: \`\`\`yml\n${stat.user?.bio ?? "None"}\n\`\`\``
                        })
                    ]
                });
                stat.destroy();
                // eslint-disable-next-line no-empty
            }
            catch (e) {
                console.log(e);
                msg.channel.send("Uh your token is so bad it cant be searched");
            }
        }
    });
    cm.register({
        command: "refresh",
        category: "API",
        hidden: true,
        handler: async (msg) => {
            const args = ap(msg.content, true);
            if (!args[1])
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(msg.lang, "command.run.invaild"),
                            color: i18n.globe["color"]
                        }
                    ]
                });
            if (!args[1].includes("."))
                return msg.channel.send("stop fucking give me random text to login you dont even have a dot in your token you retard");
            let self = new Self.Client({
                checkUpdate: false
            });
            try {
                const stat = (await (async function () {
                    await self.login(args[1]);
                    return self;
                })());
                let nt = await stat.createToken();
                msg.channel.send(`new token:\`${nt}\``);
                stat.destroy();
                // eslint-disable-next-line no-empty
            }
            catch (e) {
                console.log(e);
                msg.channel.send("Current token cant be logged in or refresh. -> " + e.message);
            }
        }
    });
}
module.exports = load;
function IsJsonString(str) {
    let o;
    try {
        o = JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    if (o && typeof o === "object")
        return true;
    return false;
}
function checkFlags(flagNumber, ignore = true) {
    let results = [];
    let bflag = BigInt(flagNumber);
    for (let i = 0; i <= 64; i++) {
        const bitwise = 1n << BigInt(i);
        if (bflag & bitwise) {
            const flag = Object.entries(flags_json_1.default).find(f => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
            if (flags_json_1.default[flag]?.unimportant)
                continue;
            results.push(flag);
        }
    }
    return results.join(", ") || "NONE";
}
//# sourceMappingURL=index.js.map