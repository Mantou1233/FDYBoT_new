import en from "../assets/lang/en.json";
import cn from "../assets/lang/zh_cn.json";
import tw from "../assets/lang/zh_tw.json";

export let langs = { en, cn, tw }

export const langAlias = {
    zh: ["zh-cn"],
    tw: ["zh-tw"]
}

export let globes = {
    color: parseInt("CFF2FF", 16)
}
export type langTypes = keyof typeof langs;
class i18n{
    public globe: any
    constructor(){
        this.globe = globes
    }
    parse(lang: any, string: string, ...opt): string{
        if(!Object.keys(langs).includes(lang)) throw new Error("No lang specified found!");
        let str = langs[lang][string] ?? langs["en"][string] ?? "%s"
        for(let ot of opt) str = str.replace("%s", `${ot}`)
        return str;
    }
}

globalThis.i18n = new i18n();