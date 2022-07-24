"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_glob_1 = __importDefault(require("fast-glob"));
const CommandManager_1 = __importDefault(require("./CommandManager"));
const outpath = "../../";
const log = (times, message) => console.log(`${"  ".repeat(times)}-> ${message}`);
let temp = -1;
class PluginLoader {
    constructor(client) {
        global.loading = -1;
        client.manager = new CommandManager_1.default(client);
        this.client = client;
        this.loadedList = [];
        this.unloadList = [];
        this.loadedNames = [];
    }
    async load(path = "src/plugins") {
        const plugins = await (await (0, fast_glob_1.default)(["**/.plugin.json"], { dot: true }))
            .map(e => e.replace(".plugin.json", ""))
            .filter(e => e.includes("dist")); //precheck smh >_<
        log(0, `fetched ${plugins.length} plugin${plugins.length > 1 ? "s" : ""}!`);
        log(1, "Loading plugin...");
        for (const plugin of plugins) {
            let pluginName = plugin.replace(path, "").split("/").pop();
            try {
                temp = require(`${outpath}${plugin}.plugin.json`);
            }
            catch (e) {
                log(3, `Loading config ${pluginName} fail: ${e.message}`);
                continue;
            }
            pluginName = temp.name;
            if (this.loadedNames.includes(pluginName))
                throw new Error("Plugin Names should be unique!");
            this.loadedNames.push(pluginName);
            global.loading = pluginName;
            const entry = (await Promise.resolve().then(() => __importStar(require(`${outpath}${plugin}${temp.entry.replace(".js", "")}`)))).default;
            this.unloadList.push(`${outpath}${plugin}.plugin.json`, `${outpath}${plugin}${temp.entry}`);
            if (temp?.reload)
                this.unloadList.push(...temp.reload.map(a => `${outpath}${plugin}${a}`));
            try {
                await entry(this.client, this.client.manager);
            }
            catch (e) {
                log(3, `Launching plugin ${pluginName} fail: ${e.message}`);
                continue;
            }
            log(2, `Loaded plugin ${pluginName}!`);
            continue;
        }
        log(1, "Plugin loaded!");
        log(0, "Bot started!");
    }
    async expo() {
        for (let uw of Object.keys(require.cache)) {
            delete require.cache[uw];
        }
        require("../");
    }
}
exports.default = PluginLoader;
//# sourceMappingURL=PluginLoader.js.map