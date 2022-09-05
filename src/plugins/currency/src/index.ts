import CommandManager from "../../../core/CommandManager";
import QuickLoader, {rez} from "../../../core/util/QuickLoaderer";

let ql = new QuickLoader({
    include: ["economy", "inventory", "fish", "use", "sell", "travel", "overload"],
    pattern: [rez(__dirname) + "/*.js"],

});
/**
 * ImportDefaultable
 * @param v module imported
 * @returns module that is default or is expr or a object
 */
const impd = (v) => v.default ?? v ?? {};
/**
 * @returns void
 */
async function load(client, cm: CommandManager) {
    await ql.load(
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        v => impd(require(v))(client, cm)
    );
}

export default load;
