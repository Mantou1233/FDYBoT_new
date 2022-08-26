"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inventory_1 = __importDefault(require("../../../services/inventory"));
exports.default = {
    use: {
        bundle: async (msg, p) => {
            inventory_1.default.addItem(p, "fishing_rod", 1);
            inventory_1.default.removeItem(p, "bundle", 1);
            p.coin += 2000;
            msg.channel.send("You have opened the bundle! You got a fishing rod and 2000 coins.");
            p.save();
        }
    },
    equip: {
        fishing_rod: {
            add: async (msg, p) => {
                inventory_1.default.removeItem(p, "fishing_rod", 1);
                p.equip.rod = "fishing_rod";
                msg.channel.send("You have equipped fishing rod!");
                p.save();
            },
            remove: async (msg, p) => {
                p.equip.rod = -1;
                inventory_1.default.addItem(p, "fishing_rod", 1);
                msg.channel.send("You have uequipped fishing rod!");
                p.save();
            }
        }
    },
    buy: {
        paketa: {}
    }
};
//# sourceMappingURL=handlers.js.map