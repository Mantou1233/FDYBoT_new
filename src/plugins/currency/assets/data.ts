import Discord from "discord.js";

// decided not to use JSON cause em types init here
export type QueueType = {
    id: string
    channel: Discord.TextBasedChannel | {
        send: (...args: Parameters<Discord.TextBasedChannel["send"]>) => any
    }
    location: string //TLocations,
    lootOverride?: Record<string, number>
    flow: number
    time: number // in seconds
    lapse: number,
    lang: string
};
export const locations = {
    plains: {
        time: 180,
        loots: {
            seeds: 3,
            wood: 2,
            azure_bluet: 1,
            grass: 1,
            apple: 1,
        }
    }
};
export const sell = {
    fish: 10,
    cod: 20,
    salmon: 40,
    squid: 50
};
export type TLocations = keyof typeof locations;