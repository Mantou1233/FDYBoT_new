"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const inventory_1 = __importDefault(require("../../../services/inventory"));
const Database_1 = require("../../../core/Database");
const queue_1 = __importDefault(require("./queue"));
const loots = {};
/**
 * @returns void
 */
async function load(client, cm) {
    setInterval(() => {
        let index = 0;
        for (let q of queue_1.default.tripQueue) {
            q.time -= 1;
            if (q.time == 0) {
                const p = new Database_1.Profile(q.id);
                let result = {};
                for (let [k, v] of (Object.entries(Object.assign({}, loots[q.location] ?? {}, q.lootOverride ?? {})))) {
                    result[k] = random(0, v);
                    inventory_1.default.addItem(p, k, result[k]);
                }
                q.channel.send({
                    content: `<@${q.id}>`,
                    embeds: [
                        new discord_js_1.default.EmbedBuilder()
                            .setTitle(`you traveled at ${q.location} and got `)
                            .setDescription((function (res, str = "") {
                            for (let [k, v] of Object.entries(res)) {
                                if (v < 1)
                                    continue;
                                str += i18n.parse("en", "currency.format.result", inventory_1.default.toDisplay("en", k, true), `${v}\n`);
                            }
                            return str;
                        })(result))
                            .setColor(i18n.globe.color)
                    ]
                });
                queue_1.default.tripQueue.splice(index, 1);
                p.save();
                continue;
            }
            if (random(0, 100) > 98 && q.time % 2 == 0) {
                q.channel.send({
                    content: `<@${q.id}>`,
                    embeds: [
                        new discord_js_1.default.EmbedBuilder()
                            .setTitle("lmao")
                            .setDescription("ur duck fucking dead because imposter killed ur duck")
                            .setColor(i18n.globe.color)
                    ]
                });
                queue_1.default.tripQueue.splice(index, 1);
            }
            index++;
        }
    }, 1000);
    // cm.register({
    //     command: "stats",
    //     category: "Basic",
    //     desc: "Display information saved from you",
    //     handler: async (msg, { prefix }) => {
    //         let p = new Profile(msg.author.id) as UserSchema;
    //         msg.channel.send(
    //             `You chatted ${p.chatCount} times! \nLevel ${p.level}, ${p.exp[0]} / ${p.exp[1]}\nCurrently equipped ${p.equip.rod !== -1? im.toDisplay(msg.lang, p.equip.rod) : "no fishing rod"}`
    //         );
    //     }
    // });
}
exports.default = load;
//# sourceMappingURL=overload.js.map