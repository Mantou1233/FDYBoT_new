import { langTypes } from "../../services/i18n";
import { Profile } from "../Database";
import { Copy, RemoveIndex } from "../Utils";
import { TLocations } from "../../plugins/currency/assets/data";
declare const _default: {
    user: {
        lang: string;
        coin: number;
        coinFactor: number;
        bank: number;
        bankAmount: number;
        bankLastAction: number;
        bankInterestFactor: number;
        signCount: number;
        lastSign: number;
        exp: number[];
        level: number;
        mana: number[];
        inv: {
            bundle: number;
        };
        equip: {
            rod: number;
        };
        location: string;
        chatCount: number;
        commandInfo: {
            lastAction: number;
            help: number;
            cooldownOverride: {};
            permissionLevel: number;
        };
    };
};
export default _default;
export type RawUserSchema = {
    lang: langTypes;
    coin: number;
    coinFactor: number;
    bank: number;
    bankAmount: number;
    bankLastAction: number;
    bankInterestFactor: number;
    signCount: number;
    lastSign: ReturnType<typeof Date.now>;
    exp: [number, number, number];
    level: number;
    mana: [number, number];
    inv: {
        [k: string]: number;
    };
    equip: {
        rod: eq;
    };
    location: TLocations;
    chatCount: number;
    commandInfo: {
        lastAction: ReturnType<typeof Date.now>;
        help: number;
        cooldownOverride: {
            [k: string]: number;
        };
        permissionLevel: number;
    };
};
export type UserSchema = RemoveIndex<Copy<Profile & RawUserSchema>>;
type eq = -1 | string;
