"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../../../core/Database");
const queue_1 = __importDefault(require("./queue"));
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "travel",
        category: "Currency",
        desc: "go travel",
        handler: async (msg, { prefix }) => {
            let args = ap(msg.content, true);
            let p = new Database_1.Profile(msg.author.id);
            if (!args[1])
                return;
            queue_1.default.tripQueue.push({
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: 30,
                lootOverride: {
                    sussy: 1,
                    aaaa: 1,
                    fish: 114514
                }
            });
            msg.reply(`duck is now travling in ${args[1]}`);
        }
    });
}
exports.default = load;
//# sourceMappingURL=travel.js.map