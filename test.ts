import "reflect-metadata";

type Constructor = { new (...args: any[]): any };

function RegisterPlugin(param: string | {name: string}){
	if(typeof param == "string") param = {name: param};
	return function<T extends Constructor>(BaseClass: T) {
		const a = class Plugin extends BaseClass {};
		Reflect.defineMetadata("PluginInfo", param, a);
		return a;
	};
}

@RegisterPlugin("name")
class C {
	[x: string]: Object;
	public foo = "foo";
	public num = 24;
}

console.log(Reflect.getMetadata("PluginInfo", C));
// -> {"foo":"foo","num":24}
