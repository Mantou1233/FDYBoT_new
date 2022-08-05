import CommandManager from "../../../core/CommandManager";

import __0 from "./economy";
import __1 from "./inventory";
import __2 from "./fish";
import __3 from "./use";
import __4 from "./sell";


/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    __0(client, cm);
    __1(client, cm);
    __2(client, cm);
    __3(client, cm);
    __4(client, cm);
}

export default load;
