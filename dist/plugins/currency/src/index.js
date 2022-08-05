"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const economy_1 = __importDefault(require("./economy"));
const inventory_1 = __importDefault(require("./inventory"));
const fish_1 = __importDefault(require("./fish"));
const use_1 = __importDefault(require("./use"));
const sell_1 = __importDefault(require("./sell"));
/**
 * @returns void
 */
async function load(client, cm) {
    (0, economy_1.default)(client, cm);
    (0, inventory_1.default)(client, cm);
    (0, fish_1.default)(client, cm);
    (0, use_1.default)(client, cm);
    (0, sell_1.default)(client, cm);
}
exports.default = load;
//# sourceMappingURL=index.js.map