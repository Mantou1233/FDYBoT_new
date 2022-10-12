const parse = require("./testim.js");

const a = parse("!ban \"V1sua1lwpa4t is sus\" -flags 128 -reason \"sussy baka\" -force", {
    "reason": true,
    flags: "int",
    force: false
})


// console.log({
//     args: [ '!ban', 'V1sua1lwpa4t is sus' ],
//     flags: { flags: 128, reason: 'sussy baka', force: true }
//   })




console.log(a)