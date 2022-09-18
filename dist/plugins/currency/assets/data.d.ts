import Discord from "discord.js";
export type QueueType = {
    id: string;
    channel: Discord.TextBasedChannel | {
        send: (...args: Parameters<Discord.TextBasedChannel["send"]>) => any;
    };
    location: string;
    lootOverride?: Record<string, number>;
    flow: number;
    time: number;
    lapse: number;
};
export declare const locations: {
    plains: {
        time: number;
        loots: {
            stick: number;
            seeds: number;
            log: number;
            apple: number;
            "repeat-duck": number;
        };
    };
};
export declare const sell: {
    fish: number;
    cod: number;
    salmon: number;
    squid: number;
};
export type TLocations = keyof typeof locations;
