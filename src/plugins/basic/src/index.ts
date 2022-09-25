import { Cogs, Command, Inject } from "../../../core/decorators/Base";
import { PluginMixin } from "../../../core/decorators/Plugin";


class BasicPlugin extends PluginMixin("Basic"){
    @Inject client;
	@Cogs(["./test", "./test2"]) externals;
    @Command({ override: {
        name: "shz"
    } })
    echo(msg){
        msg.reply("test");
    }
}

export default BasicPlugin;