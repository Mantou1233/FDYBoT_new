import Discord from "discord.js";

// decided not to use JSON cause em types init here
export type QueueType = {
    id: string,
    channel: Discord.TextBasedChannel | {
        send: (...args: Parameters<Discord.TextBasedChannel["send"]>) => any
    },
    location: string //TLocations,
    lootOverride?: Record<string, number>
    time: number // in seconds
};
export const locations = {
    plains: {
        loot: {
            
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