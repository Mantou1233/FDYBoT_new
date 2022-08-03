import { langTypes } from "../../services/i18n";
import { Profile } from "../Database";

export default {
    user: {
        lang: "en",
        coin: 1000,
        coinFactor: 0,
        bank: 2000,
        bankAmount: 5000,
        bankLastAction: 0,
        bankInterestFactor: -1,
        bankFactor: 0.1, 
        signCount: 0,
        lastSign: 0, 
        exp: [0, 75, 9],
        level: 1, 
        mana: [0, 100],
        inv: {
            bundle: 1
        },
        equip: {
            rod: -1,
            weapon: [-1, -1, -1], 
            armor: [-1, -1, -1, -1]
        },
        chatCount: 0,
        commandInfo: {
            // 
            help: -1,
            cooldownOverride: {},
            permissionLevel: 1
        }
    }
};

export type RawUserSchema = {
    lang: langTypes,
    coin: number,
    /** @deprecated */ coinFactor: number, 
    bank: number,
    bankAmount: number, // max val of bank saving
    bankLastAction: number, // Date.now()
    bankInterestFactor: number, // factor as chatCount chance to add
     /** @deprecated */ bankFactor: number,
    signCount: number,
    lastSign: number, // Date.now()
    exp: [number, number, number], // [0] = xp, [1] = max xp, [2] = factor
    level: number,
    mana: [number, number], // [current, max]
    inv: {
        //[K in keyof Items]: number
        [k: string]: number
    },
    equip: {
        rod: eq, // Fishing rod
        weapon: [eq, eq, eq], // sword, wand, unused 
        armor: [eq, eq, eq, eq] // head, chest, leg, shoe
    },
    chatCount: number,
    commandInfo: {
        // 
        help: number,
        cooldownOverride: {
            //[K in keyof commands]: number,
            [k: string]: number
        },
        permissionLevel: number
    }
};

export type UserSchema = Profile & RawUserSchema
type eq = -1 | string;