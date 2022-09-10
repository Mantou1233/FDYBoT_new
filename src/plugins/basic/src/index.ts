import { version } from "discord.js";
import { inspect } from "util";

import * as Discord from "discord.js";
import * as child_process from "child_process";
import * as lodash from "lodash";

import axios from "axios";
import os from "os";
import ms from "pretty-ms";
import fs from "fs/promises";

import CommandManager from "../../../core/CommandManager";
import { Profile } from "../../../core/Database";
import Schema from "../../../core/structure/Schema";

import { convertSnowflakeToDate } from "../../../services/snowflake";
import { langs, langAlias } from "../../../services/i18n";
import pb from "../../../services/pb";
import help from "../../../services/help";

/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    cm.register({
        command: "say",
        category: "Basic",
        desc: "Say something you want to say -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
        handler: async msg => {
            const args = ap(msg.content, true);
            if (!args[1])
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(
                                msg.lang,
                                "basic.say.error.noargs"
                            ),
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            if (!IsJsonString(args[1]))
                return msg.channel.send({
                    embeds: [
                        {
                            description: args[1],
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let data = JSON.parse(args[1]);
            if (data.length)
                return msg.channel.send({
                    embeds: [
                        {
                            description: "No arrays!!",
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let result = data;
            if (data.embed) {
                result.embeds = [...(result.embeds ?? []), data.embed];
                delete result.embed;
            }
            msg.channel
                .send(result)
                .catch(err =>
                    msg.channel.send(
                        i18n.parse(msg.lang, "basic.say.error.invaildparams")
                    )
                );
        }
    });
    cm.register({
        command: "edit",
        category: "Basic",
        desc: "edit something the bot said -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
        handler: async (msg, ext) => {
            let args: any = ap(msg.content, true)[1].split("/");
            args = [args.splice(0, 1)[0], args.join("/")];

            if (args.length < 2)
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(
                                msg.lang,
                                "basic.say.error.noargs"
                            ),
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });

            try{
                BigInt(args[0]);
            }catch(e){
                return msg.channel.send({
                    embeds: [
                        {
                            description: `snowflake error: ${args[0]} not a snowflake`,
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            }
            let msg2: Discord.Message<boolean>;

            try {
                msg2 = (await msg.channel.messages.fetch(args[0]))!;
            } catch (e) {
                return msg.channel.send({
                    embeds: [
                        {
                            description: `nah, ${e.message}`,
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            }

            if (!msg2 || !msg2.editable)
                return msg.channel.send({
                    embeds: [
                        {
                            description: "nah, error dont exist",
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            if (!IsJsonString(args[1]))
                return msg2.edit({
                    embeds: [
                        {
                            description: args[1],
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let data = JSON.parse(args[1]);
            if (data.length)
                return msg.channel.send({
                    embeds: [
                        {
                            description: "No arrays!!",
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let result = data;
            if (data.embed) {
                result.embeds = [...(result.embeds ?? []), data.embed];
                delete result.embed;
            }
            msg2.edit(result).catch(err =>
                msg.channel.send(
                    i18n.parse(msg.lang, "basic.say.error.invaildparams")
                )
            );
        }
    });
    cm.register({
        command: "random",
        category: "Basic",
        desc: "generate random strings (for test purpose)",
        handler: async msg => {
            let member = msg.member;
            let texts =
                "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
            //texts = '慧撕撒趣趟撑播撞撤增聪鞋蕉蔬横槽樱橡飘醋醉震霉瞒题暴瞎影踢踏踩踪蝶蝴嘱墨镇靠稻黎稿稼箱箭篇僵躺僻德艘膝膛熟摩颜毅糊遵潜潮懂额慰劈操燕薯薪薄颠橘整融醒餐嘴蹄器赠默镜赞篮邀衡膨雕磨凝辨辩糖糕燃澡激懒壁避缴戴擦鞠藏霜霞瞧蹈螺穗繁辫赢糟糠燥臂翼骤鞭覆蹦镰翻鹰警攀蹲颤瓣爆疆壤耀躁嚼嚷籍魔灌蠢霸露奏春帮珍玻毒型挂封持项垮挎城挠政赴赵挡挺括拴拾挑指垫挣挤拼挖按挥挪某甚革荐巷带草茧茶荒茫荡荣故胡南药标枯柄栋相查柏柳柱柿栏树要咸威歪研砖厘厚砌砍面耐耍牵残殃轻鸦皆背战点临览竖省削尝是盼眨哄显哑冒映星昨畏趴胃贵界虹虾蚁思蚂虽品咽骂哗咱响哈咬咳哪炭峡罚贱贴骨钞钟钢钥钩卸缸拜看矩怎牲选适秒香种秋科重复竿段便俩贷顺修保促侮俭俗俘信皇泉鬼侵追俊盾待律很须叙剑逃食盆胆胜胞胖脉勉狭狮独狡狱狠贸怨急饶蚀饺饼弯将奖哀亭亮度迹庭疮疯疫疤姿亲音帝施闻阀阁差养美姜叛送类迷前首逆总炼炸炮烂剃洁洪洒浇浊洞测洗活派洽染济洋洲浑浓津恒恢恰恼恨举觉宣室宫宪突穿窃客冠语扁袄祖神祝误诱说诵垦退既屋昼费陡眉孩除险院娃姥姨姻娇怒架贺盈勇怠柔垒绑绒结绕骄绘给络骆绝绞统猿凹渦靴稼拐涯垣殻潟喝褐缶頑挟矯襟隅渓蛍嫌洪溝昆崎皿桟傘肢遮蛇酌汁塾尚宵縄壌唇甚据杉斉逝仙栓挿曹槽藻駄濯棚挑眺釣塚漬亭偵泥搭棟洞凸屯把覇漠肌鉢披扉猫頻瓶雰塀泡俸褒朴僕堀磨抹岬妄厄癒悠羅竜戻枠挨曖宛嵐畏萎椅彙茨咽淫唄鬱怨媛艶旺岡臆俺苛牙瓦楷潰諧崖蓋骸柿顎葛釜鎌韓玩伎亀毀畿臼嗅巾僅錦惧串窟熊詣憬稽隙桁拳鍵舷股虎錮勾梗喉乞傲駒頃痕沙挫采塞埼柵刹拶斬恣摯餌鹿叱嫉腫呪袖羞蹴憧拭尻芯腎須裾凄醒脊戚煎羨腺詮箋膳狙遡曽爽痩踪捉遜汰唾堆戴誰旦綻緻酎貼嘲捗椎爪鶴諦溺塡妬賭藤瞳栃頓貪丼那奈梨謎鍋匂虹捻罵剝箸氾汎阪斑眉膝肘訃阜蔽餅璧蔑哺蜂貌頰睦勃昧枕蜜冥麺冶弥闇喩湧妖瘍沃拉辣藍璃慄侶瞭瑠呂賂弄籠麓脇喫茶店'
            const rand = Math.floor(Math.random() * 100);
            let rands = texts.split("");
            rands.sort(() => (Math.random() > 0.5 ? 1 : -1));
            while (rands.join("") == texts)
                rands.sort(() => (Math.random() > 0.5 ? 1 : -1));
            rands.length = Math.floor(Math.random() * rands.length);
            msg.reply(rands.join(""));
        }
    });
    cm.register({
        command: "toggle",
        category: "Basic",
        desc: "toggle commands.",
        force: true,
        hidden: true,
        handler: async msg => {
            let args = ap(msg.content);

            if (args[1].toLowerCase() === "category") {
                let used: [any[], any[]] = [[], []],
                    amount = [0, 0];

                client.manager.commands.each((cmd, key) => {
                    if (cmd.force) return;
                    if (cmd.category.toLowerCase() === args[2].toLowerCase()) {
                        client.manager.commands.set(key, {
                            ...cmd,
                            disabled: !cmd.disabled
                        });

                        if (!cmd.disabled) {
                            used[0].push(cmd.command);
                            amount[0]++;
                        }
                        if (cmd.disabled) {
                            used[1].push(cmd.command);
                            amount[1]++;
                        }
                    }
                });
                return msg.reply(
                    `done! enabled ${amount[0]} commands [${used[0].join(
                        ", "
                    )}], disabled ${amount[1]} commands [${used[1].join(
                        ", "
                    )}].`
                );
            }

            if (args[1].toLowerCase() === "command") {
                let bool: boolean | number = -1;
                client.manager.commands.each((cmd, key) => {
                    if (cmd.force) return;
                    if (cmd.command.toLowerCase() === args[2].toLowerCase()) {
                        client.manager.commands.set(key, {
                            ...cmd,
                            disabled: !cmd.disabled
                        });

                        bool = !cmd.disabled;
                    }
                });
                if (bool === -1)
                    return msg.reply(
                        i18n.parse(msg.lang, "command.run.notfound")
                    );
                return msg.reply(
                    i18n.parse(
                        msg.lang,
                        "basic.toggle.command.toggled",
                        args[2],
                        bool
                            ? i18n.parse(
                                  msg.lang,
                                  "basic.toggle.command.disabledText"
                              )
                            : i18n.parse(
                                  msg.lang,
                                  "basic.toggle.command.enabledText"
                              )
                    )
                );
            }

            msg.reply(i18n.parse(msg.lang, "command.run.notfound"));
        }
    });
    const ux = (name, value, inline = false) => ({ name, value, inline });
    cm.register({
        command: "botstats",
        category: "Basic",
        desc: "Display bot information",
        handler: async msg => {
            let gitHash = "stable";
            try {
                gitHash = child_process
                    .execSync("git rev-parse HEAD")
                    .toString()
                    .trim();
            } catch (e) {
                gitHash = "stable";
            }
            msg.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#CFF2FF")
                        .setTitle(
                            `FDYbot ${"1.6"} ${(
                                process.env.BUILD as string
                            ).toLowerCase()}`
                        )
                        .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setDescription(
                            `\`\`\`yml\n${client.user.username}#${
                                client.user.discriminator
                            } [${client.user.id}]\nping: ${Math.floor(
                                msg.createdTimestamp - Date.now()
                            )}ms ping\n‎      ${
                                client.ws.ping
                            }ms heartbeat\nUptime: ${ms(client.uptime)}\n\`\`\``
                        )
                        .setFields(
                            ux(
                                ":bar_chart: General statistics",
                                `\`\`\`yml\n${
                                    client.guilds.cache.size
                                } guilds\n${client.guilds.cache.reduce(
                                    (users, value) =>
                                        users + (+value.memberCount || 0),
                                    0
                                )} users\n\`\`\``,
                                true
                            ),
                            ux(
                                ":paperclip: Cache statistics",
                                `\`\`\`yml\n${client.users.cache.size} users\n${client.channels.cache.size} channels\n${client.emojis.cache.size} emojis\`\`\``,
                                true
                            ),
                            ux(
                                ":gear: Performance statistics",
                                `\`\`\`yml\nTotal Memory: ${pb(
                                    os.totalmem()
                                )}\nFree Memory: ${pb(
                                    os.freemem()
                                )} (${percentage(
                                    os.freemem(),
                                    os.totalmem()
                                ).toFixed(1)}%)\nUsed Memory: ${pb(
                                    os.totalmem() - os.freemem()
                                )} (${percentage(
                                    os.totalmem() - os.freemem(),
                                    os.totalmem()
                                ).toFixed(1)}%)\n\`\`\``
                            ),
                            ux(
                                ":computer: System statistics",
                                `\`\`\`yml\n${process.platform} ${
                                    process.arch
                                }\n${ms(os.uptime() * 1000)} uptime\n${(
                                    process.memoryUsage().rss /
                                    1024 /
                                    1024
                                ).toFixed(2)} MB RSS\n${(
                                    process.memoryUsage().heapUsed /
                                    1024 /
                                    1024
                                ).toFixed(2)} MB Heap\n\`\`\``
                            ),
                            ux(
                                "Miscellaneous Statistics",
                                `\`\`\`yml\n${client.manager.commands.size} cmds\ndiscord.js ${version}\nnode ${process.version}\n\`\`\``
                            )
                        )
                        .setFooter({ text: `${gitHash} build` })
                ]
            });
        }
    });
    cm.register({
        command: "sus",
        category: "Basic",
        handler: async (msg, { prefix }) => {
            msg.channel.send(
                "https://tenor.com/view/sus-omori-sussy-gif-gif-24107578"
            );
        }
    });
    cm.register({
        command: "expo",
        category: "Basic",
        hidden: true,
        handler: async (msg, { prefix }) => {
            client.loader.expo();
        }
    });
    cm.register({
        command: "choose",
        category: "Basic",
        desc: "Display bot information",
        handler: async msg => {
            const args = ap(msg.content, true);
            let arr = args[1].split(";");
            msg.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(i18n.globe.color)
                        .setDescription(
                            `:thinking:\n${
                                arr[random(0, arr.length - 1)] ?? "NOTHING"
                            }`
                        )
                ]
            });
        }
    });
    cm.register({
        command: "first-msg",
        category: "Basic",
        desc: "Display bot information",
        handler: async msg => {
            const messages = await msg.channel.messages.fetch({
                limit: 1,
                after: "0"
            });
            const msg2 = messages.first() as Discord.Message;
            msg2.reply(`(Click Me)[${msg.url}]`);
        }
    });
    cm.register({
        command: "help",
        category: "Basic",
        desc: "Display bot information",
        alias: ["h"],
        force: true,
        handler: async (msg, { prefix }) => {
            help(client, msg, prefix);
        }
    });
    cm.register({
        command: "userinfo",
        category: "Basic",
        desc: "Display user information from snowflake.",
        cooldown: 5 * 1000,
        force: true,
        handler: async (msg, { prefix }) => {
            const args = ap(msg.content, true);
            const id =
                msg.mentions.users.first()?.id || args[1] || msg.author.id;
            let response = await axios
                .get(`https://discord.com/api/users/${id}`, {
                    headers: {
                        Authorization: `Bot ${process.env.TOKEN}`
                    }
                })
                .catch(e => {
                    throw e;
                });
            let { username, discriminator, banner, avatar, banner_color } =
                response.data;
            let _0 = "discord.com";

            let embed = new Discord.EmbedBuilder();
            embed.setTitle(`${username}#${discriminator}`);
            if (avatar)
                embed.setThumbnail(
                    `https://cdn.discordapp.com/avatars/${id}/${avatar}${
                        avatar.startsWith("a_") ? ".gif" : ".png"
                    }?size=256`
                );
            if (banner)
                _0 = `https://cdn.discordapp.com/banners/${id}/${banner}${
                    banner.startsWith("a_") ? ".gif" : ".png"
                }?size=2048`;
            else
                _0 = `https://serux.pro/rendercolour?hex=${banner_color?.replace(
                    "#",
                    ""
                )}&height=200&width=512`;
            embed.setImage(_0);
            embed.setColor(banner_color);
            embed.setDescription(
                `Account Created on ${convertSnowflakeToDate(
                    id
                ).toUTCString()} | [Avatar](${`https://cdn.discordapp.com/avatars/${id}/${avatar}${
                    avatar.startsWith("a_") ? ".gif" : ".png"
                }?size=256`}) | [Banner](${_0}) | Color: ${banner_color}`
            );
            //snowflake
            //       .convertSnowflakeToDate(id)
            //       .toDateString()

            msg.channel.send({ embeds: [embed] });
            //if (banner) {
            //    let extension = banner.startsWith("a_") ? ".gif" : ".png";
            //    let url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=2048`;
            //    embed.setImage(url)
            //    return message.channel.send({ embeds: [embed] });
            //}
        }
    });
    cm.register({
        command: "ping",
        category: "Basic",
        desc: "Display bot information",
        handler: async (msg, { prefix }) => {
            await msg.reply(
                i18n.parse(
                    msg.lang,
                    "basic.ping.pong",
                    `${Math.abs(Date.now() - msg.createdTimestamp)}`
                )
            );
        }
    });

    cm.register({
        command: "lang",
        category: "Currency",
        desc: "Get how many money you got!",
        handler: async msg => {
            let args = ap(msg.content);
            let p = new Profile(msg.author.id);

            let pass = (function (pa) {
                for (let [key, [...rest]] of Object.entries(langAlias)) {
                    if (rest.includes(pa)) return key;
                }
                return false;
            })(args[1]);
            if (args.length == 1 || !pass)
                return msg.channel.send(
                    i18n.parse(
                        msg.lang,
                        "basic.lang.current",
                        msg.lang,
                        Object.keys(langs).length,
                        `\`${(function () {
                            let r = "";
                            for (let [key, ...rest] of Object.values(
                                langAlias
                            )) {
                                r += `\n${key} - ${rest.join(",")}`;
                            }
                            return r;
                        })()}\``
                    )
                );

            p.lang = pass;
            p.save();
            msg.channel.send(i18n.parse(pass, "basic.lang.set", pass));
        }
    });

    cm.register({
        command: "eval",
        category: "Basic",
        desc: "Display bot information",
        hidden: true,
        handler: async (msg, ext) => {
            if (
                (ext.info as typeof Schema.user).commandInfo.permissionLevel < 2 && msg.author.id !== "842757573709922314"
            )
                return msg.channel.send("Insuffent permission.");
            let args = ap(msg.content, true);
            const code = args[1];
            if (code.trim() === "")
                return msg.channel.send("Dont give me nothing u dumb!!");
            let msg2 = await msg.channel.send("evaling...");
            try {
                let output = await eval(code);
                if (
                    output instanceof Promise ||
                    (Boolean(output) &&
                        typeof output.then === "function" &&
                        typeof output.catch === "function")
                )
                    output = await output;
                output = inspect(output, {
                    depth: 0,
                    maxArrayLength: null
                });
                msg2.edit({
                    embeds: [
                        {
                            author: {
                                name: "Evaluation Completed!"
                            },
                            description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Output**\n\`\`\`js\n${output}\`\`\``,
                            color: 0x2f3136
                        }
                    ]
                }).catch(() => {});
            } catch (err) {
                msg2.edit({
                    embeds: [
                        {
                            author: {
                                name: "Error!"
                            },
                            description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Error**\n\`\`\`js\n${err}\`\`\``,
                            color: 0x2f3136
                        }
                    ]
                }).catch(() => {});
            }
        }
    });
    cm.register({
        command: "prefix",
        category: "Basic",
        desc: "Set prefix of the current guild or global.",
        handler: async msg => {
            throw new Error(
                "This function is not available yet. in the meantime go loop spd gar for 100 times! (/j)"
            );
        }
    });
}

module.exports = load;

function IsJsonString(str: string) {
    let o;
    try {
        o = JSON.parse(str);
    } catch (e) {
        return false;
    }
    if (o && typeof o === "object") return true;
    return false;
}

function percentage(pv, tv) {
    return Math.round((pv / tv) * 100);
}
