const os = require("os")

function percentage(pv, tv) {
    return Math.round((pv / tv) * 100);
}

console.log(
    percentage(
        os.freemem(),
        os.totalmem()
    ).toFixed(1) + "%"
)


console.log(
    percentage(
        os.totalmem() - os.freemem(),
        os.totalmem()
    ).toFixed(1) + "%"
)

