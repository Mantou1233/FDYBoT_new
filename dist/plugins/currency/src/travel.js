"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../../../core/Database");
const queue_1 = __importDefault(require("./queue"));
const data_1 = require("../assets/data");
const math_1 = require("../../../services/math");
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
            const current = queue_1.default.tripQueue[msg.author.id];
            if (current)
                return msg.channel.send(`Your duck is already on travel! (${(0, math_1.toPercent)(current.lapse - current.time, current.lapse)})`);
            if (!args[1])
                return msg.channel.send("invaild location! use `+map` to see a list of maps.");
            if (!Object.keys(data_1.locations).includes(args[1]))
                return msg.channel.send("that is not a vaild place.");
            queue_1.default.tripQueue[msg.author.id] = {
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: data_1.locations[args[1]].time,
                lapse: data_1.locations[args[1]].time,
                flow: 0,
                lang: msg.lang
            };
            msg.reply(`duck is now travling in ${args[1]}`);
        }
    });
    cm.register({
        command: "map",
        category: "Currency",
        desc: "see le map",
        handler: async (msg, { prefix }) => {
            msg.channel.send(`Current locations: ${1}\n${i18n.parse(msg.lang, "currency.format.result", "Plains", "Great place for you dumb ass to touch grass")} `);
        }
    });
}
exports.default = load;
//# sourceMappingURL=travel.js.map