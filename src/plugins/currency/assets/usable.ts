
import im from "../../../services/inventory";
export default {
    use: {
        bundle: async (msg, p) => {
            im.addItem(p, "fishing_rod", 1);
            im.removeItem(p, "bundle", 1);
            p.coin += 2000;
            msg.channel.send("You have opened the bundle! You got a fishing rod and 2000 coins.");
            p.save();
        }
    },
    equip: {
        fishing_rod: {
            add: async (msg, p) => {
                im.removeItem(p, "fishing_rod", 1);
                p.equip.rod = "fishing_rod";
                msg.channel.send("You have equipped fishing rod!");
                p.save();
            },
            remove: async (msg, p) => {
                p.equip.rod = -1;
                im.addItem(p, "fishing_rod", 1);
                msg.channel.send("You have uequipped fishing rod!");
                p.save();
            }
        }
    }
};