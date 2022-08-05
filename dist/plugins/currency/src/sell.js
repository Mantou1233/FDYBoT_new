"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../../../core/Database");
const loots_json_1 = require("../assets/loots.json");
const loot = loots_json_1.fishing;
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "sell",
        category: "Currency",
        desc: "See what do you got in your inventory",
        handler: async (msg, { prefix }) => {
            let p = new Database_1.Profile(msg.author.id);
        }
    });
}
exports.default = load;
//# sourceMappingURL=sell.js.map