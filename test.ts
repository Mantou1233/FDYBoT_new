import "reflect-metadata";

function command(ns){
    return function(obj, keyname, descriptor){
        Reflect.defineMetadata("command", {...ns, caller: keyname}, descriptor.value);
        return descriptor;
    };
}
function DefinePlugin(name?: string){
    return function<T extends { new (...args: any[]): {} }>(constructor: T) {
        const registries = {
            plugin: name || constructor.name,
            commands: {},
            inheritance: []
        };
        for(let [name, fn] of Object.entries(constructor.prototype)){
            const data = Reflect.getMetadata("command", fn as Function);
            if(!data) continue;
            registries.commands[name] = {...data};
        }
        Reflect.defineMetadata("plugin", registries, constructor.prototype);
    };
}

@DefinePlugin("basic")
class BasicPlugin{

    @command({
        name: "echo",
        desc: "_R_I_N_N_E"
    })
    echo(){
        
    }

    @command({
        name: "echo2",
        desc: "_R_I_ND_N_E"
    })
    echo2(){
        
    }

    @command({
        name: "eAQULA2",
        desc: "_R_I_NDEMTYA_N_E"
    })
    equa(){
        
    }
}

@DefinePlugin("basisecon")
class SecondPlugin{

    @command({
        name: "not",
        desc: "_R_I_N_N_E"
    })
    NOT(){
        
    }
}
let insts = [new BasicPlugin(), new SecondPlugin()];
for(let inst of insts){
    
    for(let [key, v] of Object.entries(
        Reflect.getMetadata("plugin", inst)
    )){
        console.log(key, v);
    }
}