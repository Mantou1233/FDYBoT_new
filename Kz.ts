import "reflect-metadata";
const info = Symbol("PluginInfo");
//function reg<T extends { new (...args: any[]): {} }>(constructor: T, K) {}
function RegisterPlugin(a: string | object) {
    if(typeof a == "string"){
        a = {
            name: a
        };
    }
    return function <T extends { new (...args: any[]): {} }>(constructor: T){
        return class Plugin extends constructor {
            [info] = {
                ...{
                    info: {
        
                    },
                    commands: [],
                    events: []
                },
                info: a
            };
        };
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

@RegisterPlugin("test")
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

