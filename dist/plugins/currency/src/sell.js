"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const inventory_1 = __importDefault(require("../../../services/inventory"));
const Database_1 = require("../../../core/Database");
const data_1 = require("../assets/data");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "sell",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, { prefix }) => {
            const args = ap(msg.content, true);
            let p = new Database_1.Profile(msg.author.id);
            let result = {};
            let price = 0;
            if (args[1] == "all") {
                for (let [i, n] of Object.entries(data_1.sell)) {
                    if (inventory_1.default.hasItem(p, i)) {
                        result[i] = p.inv[i];
                        price += p.inv[i] * n;
                        inventory_1.default.deleteItem(p, i);
                    }
                    continue;
                }
            }
            else {
                let item = inventory_1.default.getItems(args[1], Object.keys(data_1.sell));
                if (!item)
                    return msg.channel.send(i18n.parse(msg.lang, "currency.format.notFoundOrUsable"));
                if (inventory_1.default.hasItem(p, item)) {
                    result[item] = p.inv[item];
                    price += p.inv[item] * data_1.sell[item];
                    inventory_1.default.deleteItem(p, item);
                }
            }
            p.coin += price;
            p.save();
            msg.channel.send({
                embeds: [
                    new discord_js_1.default.EmbedBuilder()
                        .setTitle("You sold")
                        .setDescription((function (res, str = "") {
                        for (let [k, v] of Object.entries(res)) {
                            if (v < 1)
                                continue;
                            str += i18n.parse(msg.lang, "currency.format.result", inventory_1.default.toDisplay(msg.lang, k, true), `${v}\n`);
                        }
                        return str || "nothing\n";
                    })(result) + `and got ${price} duck coin`)
                        .setColor(i18n.globe.color)
                ]
            });
        }
    });
}
exports.default = load;
//# sourceMappingURL=sell.js.map