const players = getWorldPlayerList();

let list = [];
let cachedPlayers = [];

for (let player of players) {
    const id = player.id;
    if (id) {
        let pos = getEntityPos(id);
        cachedPlayers.push({ player, pos });
        list.push({ text: `${player.name} (Vec3 ${pos.join(", ")})` });
    }
}
addForm(
    {
        type: "form",
        title: "I LOVE THE AVOIDANCE",
        content: `共有玩家${list.length}位`,
        buttons: list
    },
    index => {
        if (index >= 0) {
            let pos = cachedPlayers[index];
            executeCommand(
                `/ww tp ${Math.ceil(pos.x)} ${Math.ceil(pos.y)} ${Math.ceil(pos.z)}`
            );
        }
    }
);
