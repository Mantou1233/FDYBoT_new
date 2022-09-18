import CommandManager from "../../../core/CommandManager";
import Discord from "discord.js";
/**
 * @returns void
 */
declare function load(client: Discord.Client, cm: CommandManager): Promise<void>;
export default load;
