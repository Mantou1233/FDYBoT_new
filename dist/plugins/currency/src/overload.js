"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const inventory_1 = __importDefault(require("../../../services/inventory"));
const Database_1 = require("../../../core/Database");
const queue_1 = __importDefault(require("./queue"));
const data_1 = require("../assets/data");
/**
 * @returns void
 */
async function load(client, cm) {
    // cm.registerBeforeChatEvent({
    // 	"name": "trip",
    // 	handler: async (msg) => {
    // 		if(queue.tripQueue[msg.author.id]) queue.tripQueue[msg.author.id].time -= random(1, 2);
    // 	}
    // });
    setInterval(() => {
        for (let [k, q] of Object.entries(queue_1.default.tripQueue)) {
            q.time -= 1;
            if (q.time <= 0) {
                const p = new Database_1.Profile(q.id);
                let result = {};
                for (let [k, v] of (Object.entries(Object.assign({}, data_1.locations[q.location].loots ?? {}, q.lootOverride ?? {})))) {
                    result[k] = random(0, v);
                    inventory_1.default.addItem(p, k, result[k]);
                }
                q.channel.send({
                    content: `<@${q.id}>`,
                    embeds: [
                        new discord_js_1.default.EmbedBuilder()
                            .setTitle(i18n.parse(q.lang, "trip.travel.text", q.location))
                            .setDescription((function (res, str = "") {
                            for (let [k, v] of Object.entries(res)) {
                                if (v < 1)
                                    continue;
                                str += i18n.parse(q.lang, "currency.format.result", inventory_1.default.toDisplay(q.lang, k, false), `${v}\n`);
                            }
                            const quotes = i18n.parse(q.lang, "trip.plains.travelquotes");
                            str += quotes[random(0, quotes.length - 1)];
                            return str;
                        })(result))
                            .setColor(i18n.globe.color)
                    ]
                });
                delete queue_1.default.tripQueue[k];
                p.save();
                continue;
            }
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