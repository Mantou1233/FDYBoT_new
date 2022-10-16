import fg from "fast-glob";
import { filter } from "mathjs";
export const cook: (s: string) => string = (s) => s.replaceAll("\\", "/");

export default class QuickLoader{
	cfg: Partial<{
		filter: (file: string) => boolean;
		pattern: Parameters<typeof fg>[0];
		include: string[]
		excludes: string[]
	}>;

	constructor(cfg: QuickLoader["cfg"]){
		this.cfg = Object.assign({}, {
			filter: (s: string) => true,
			pattern: ["**/*.js","**/*.ts"],
			include: [],
			excludes: [],
		}, cfg);
	}

	async load(handler: (v: any) => any = ((v) => v)){
		let result = await fg(this.cfg.pattern!);
		result = result.filter(
			v => 
			this.cfg.filter!(v) &&
			!this.cfg.excludes!.includes(v) &&
			this.cfg.include!.length == 0 ? true : this.cfg.include!.some(v1 => v.includes(v1))
		);
		for(let each of result){
			await handler(each);
		}
	}
}