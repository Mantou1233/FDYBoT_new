import { Client } from "discord.js";
import fg from "fast-glob";
import CommandManager from "./CommandManager";
const outpath = "../../";
const log = (times: number, message: string): void =>
    console.log(`${"  ".repeat(times)}-> ${message}`);
let temp: any = -1;
class PluginLoader {
    client: Client;
    loadedList: string[];
    unloadList: string[];
    loadedNames: string[];
    loadArgs: any;
    constructor(client) {
        global.loading = -1;
        client.manager = new CommandManager(client);
        this.client = client
        this.loadedList = [];
        this.unloadList = [];
        this.loadedNames = [];
    }

    async load(path = "src/plugins") {
        const plugins = await (await fg(["**/.plugin.json"], { dot: true }))
            .map(e => e.replace(".plugin.json", ""))
            .filter(e => e.includes("dist")); //precheck smh >_<

        log(
            0,
            `fetched ${plugins.length} plugin${plugins.length > 1 ? "s" : ""}!`
        );

        log(1, "Loading plugin...");
        for (const plugin of plugins) {
            let pluginName = plugin.replace(path, "").split("/").pop() as string;

            try {
                temp = require(`${outpath}${plugin}.plugin.json`);
            } catch (e) {
                log(3, `Loading config ${pluginName} fail: ${e.message}`);
                continue;
            }
            pluginName = temp.name;
            if (this.loadedNames.includes(pluginName))
                throw new Error("Plugin Names should be unique!");
            this.loadedNames.push(pluginName);
            global.loading = pluginName;
            const entry = (
                await import(
                    `${outpath}${plugin}${temp.entry.replace(".js", "")}`
                )
            ).default;
            this.unloadList.push(
                `${outpath}${plugin}.plugin.json`,
                `${outpath}${plugin}${temp.entry}`
            );
            if (temp?.reload)
                this.unloadList.push(
                    ...temp.reload.map(a => `${outpath}${plugin}${a}`)
                );
            try {
                await entry(this.client, this.client.manager);
            } catch (e) {
                log(3, `Launching plugin ${pluginName} fail: ${e.message}`);
                continue;
            }
            log(2, `Loaded plugin ${pluginName}!`);
            continue;
        }
        
        log(1, "Plugin loaded!");
        log(0, "Bot started!");
    }
    async expo(){
        for(let uw of Object.keys(require.cache)){
            delete require.cache[uw];
        }
        require("../");
    }
}

export default PluginLoader;
