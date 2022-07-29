import bar from "../assets/bars.json"

export function toPercent(num, total) {
    return Math.round((num / total) * 10000) / 100.0 + "%"; // 小数点后两位百分比
}

export function toSizing(num, total) {
    return Math.round((num / total) * 10000) / 100;
}

export function progressBar(value, maxValue, size) {

    let barArray: any[] = [];

    let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    let empty = size - fill > 0 ? size - fill : 0;

    for (let i = 1; i <= fill; i++) barArray.push(bar.fillBar);
    for (let i = 1; i <= empty; i++) barArray.push(bar.emptyBar);

    barArray[0] = barArray[0] == bar.fillBar ? bar.fillStart : bar.emptyStart;
    barArray[barArray.length - 1] =
        barArray[barArray.length - 1] == bar.fillBar
            ? bar.fillEnd
            : bar.emptyEnd;

    return barArray.join("");
}