import "reflect-metadata";
const info = Symbol("PluginInfo");
//function reg<T extends { new (...args: any[]): {} }>(constructor: T, K) {}
export function DefinePlugin() {
    return function <T extends { new (...args: any[]): {} }>(constructor: T){
        return class Plugin extends constructor{};
    };
}


function Inject(target: any, propKey: string | symbol){
    if(!propKey[info]) {
        target[info] = {
            info: {

            },
            commands: [],
            events: []
        };
    }
    if(propKey == "client"){
        target.client = 1;
    }
}
function Command(a) {
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
        target[info].commands.push(propKey);
    };
}

@DefinePlugin()
class BasicPlugin {
    @Inject client;
    @Command({ override: {
        name: "shz"
    } })
    echo(msg){
        msg.reply("test");
    }
}

const ins = new BasicPlugin();
console.log(ins);

