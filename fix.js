const __db__ = require("quick.db2")
const db = __db__.init("json.sqlite").$("json");

let iz = 0
for(let {key, value} of db.all()){
    let kd = false;
    if(value.coin !== 1000) iz++
    if(value.level == 1) {
        db.delete(key)
        console.log(`${key} is del${value.coin == 1000 ? "" : `, ${value.coin} coin`} - ${value.level}`)
    }
}