"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../../../core/Database");
const queue_1 = __importDefault(require("./queue"));
const data_1 = require("../assets/data");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
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
            let p = new Database_1.Profile(msg.author.id);
            let args = ap(msg.content, true) ?? [0, p.location];
            const current = queue_1.default.tripQueue[msg.author.id];
            if (current)
                return msg.channel.send(i18n.parse(msg.lang, "trip.travel.or", (0, math_1.toPercent)(current.lapse - current.time, current.lapse)));
            if (!args[1])
                return msg.channel.send(i18n.parse(msg.lang, "trip.travel.invaild", prefix));
            if (!Object.keys(data_1.locations).includes(args[1]))
                return msg.channel.send(i18n.parse(msg.lang, "trip.travel.invaild", prefix));
            queue_1.default.tripQueue[msg.author.id] = {
                id: msg.author.id,
                channel: msg.channel,
                location: args[1],
                time: data_1.locations[args[1]].time,
                lapse: data_1.locations[args[1]].time,
                flow: 0,
                lang: msg.lang
            };
            p.location = args[1];
            p.save();
            msg.reply(`duck travelin  ${args[1]} ok`);
        }
    });
    cm.register({
        command: "map",
        category: "Currency",
        desc: "see le map",
        handler: async (msg, { prefix }) => {
            msg.channel.send(`Current locations: ${Object.keys(data_1.locations).length}\n${(function () {
                let txt = "";
                for (let [place, location] of Object.entries(data_1.locations)) {
                    txt += i18n.parse(msg.lang, "currency.format.result", place, (0, pretty_ms_1.default)(location.time * 1000));
                }
                return txt;
            })()} `);
        }
    });
}
exports.default = load;
//# sourceMappingURL=travel.js.map