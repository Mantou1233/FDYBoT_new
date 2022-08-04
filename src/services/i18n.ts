import en from "../assets/lang/en.json";
import zh from "../assets/lang/zh_zh.json";
import tw from "../assets/lang/zh_tw.json";

export let langs = { en, zh, tw };

export const langAlias = {
    en: ["en", "english"],
    zh: ["zh", "zh-cn", "简体中文"],
    tw: ["tw", "zh-tw", "繁體中文"]
};
type AllKeysOf<T> = T extends T ? keyof T : never;
type KeyOfUnion<T> = (T[keyof T])

export type langKeys =
    | Exclude<
          AllKeysOf<KeyOfUnion<typeof langs>>,
          `item.${string}` | `//${string}`
      >
    | `-${string}`;

export type langTypes = keyof typeof langs;

export let globes = {
    color: parseInt("CFF2FF", 16)
};
class i18n {
    public globe: any;
    constructor() {
        this.globe = globes;
    }
    parse(
        lang: string,
        string: langKeys,
        ...opt
    ): string {
        if (string.startsWith("-")) string = string.slice(1) as `-${string}`;
        if (!Object.keys(langs).includes(lang))
            throw new Error("No lang specified found!");
        let str = langs[lang][string] ?? langs["en"][string] ?? "%s";
        for (let ot of opt) str = str.replace("%s", `${ot}`);
        return str;
    }
}

globalThis.i18n = new i18n();
