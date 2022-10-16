"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressBar = exports.toSizing = exports.toPercent = void 0;
const bars_json_1 = __importDefault(require("../assets/bars.json"));
function toPercent(num, total) {
    return `${Math.round((num / total) * 10000) / 100.0}%`;
}
exports.toPercent = toPercent;
function toSizing(num, total) {
    return Math.round((num / total) * 10000) / 100;
}
exports.toSizing = toSizing;
function progressBar(value, maxValue, size) {
    let barArray = [];
    let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    let empty = size - fill > 0 ? size - fill : 0;
    for (let i = 1; i <= fill; i++)
        barArray.push(bars_json_1.default.fillBar);
    for (let i = 1; i <= empty; i++)
        barArray.push(bars_json_1.default.emptyBar);
    barArray[0] = barArray[0] == bars_json_1.default.fillBar ? bars_json_1.default.fillStart : bars_json_1.default.emptyStart;
    barArray[barArray.length - 1] =
        barArray[barArray.length - 1] == bars_json_1.default.fillBar
            ? bars_json_1.default.fillEnd
            : bars_json_1.default.emptyEnd;
    return barArray.join("");
}
exports.progressBar = progressBar;
//# sourceMappingURL=math.js.map