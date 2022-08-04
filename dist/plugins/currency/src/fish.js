"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../../../core/Database");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "fish",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, { prefix }) => {
            let p = new Database_1.Profile(msg.author.id);
            if (p.equip.rod === -1)
                return msg.channel.send(i18n.parse(msg.lang, "currency.fish.noRod", prefix, prefix));
        }
    });
}
exports.default = load;
//# sourceMappingURL=fish.js.map