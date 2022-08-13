"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSnowflake = exports.convertSnowflakeToDate = exports.DISCORD_EPOCH = void 0;
exports.DISCORD_EPOCH = 1420070400000;
// Converts a snowflake ID string into a JS Date object using the provided epoch (in ms), or Discord's epoch if not provided
function convertSnowflakeToDate(snowflake, epoch = exports.DISCORD_EPOCH) {
    // Convert snowflake to BigInt to extract timestamp bits
    // https://discord.com/developers/docs/reference#snowflakes
    const milliseconds = BigInt(snowflake) >> 22n;
    return new Date(Number(milliseconds) + epoch);
}
exports.convertSnowflakeToDate = convertSnowflakeToDate;
// Validates a snowflake ID string and returns a JS Date object if valid
function validateSnowflake(snowflake) {
    if (!Number.isInteger(+snowflake)) {
        return "That doesn't look like a snowflake. Snowflakes contain only numbers.";
    }
    if (snowflake < 4194304) {
        return "That doesn't look like a snowflake. Snowflakes are much larger numbers.";
    }
    const timestamp = convertSnowflakeToDate(snowflake);
    if (Number.isNaN(timestamp.getTime())) {
        return "That doesn't look like a snowflake. Snowflakes have fewer digits.";
    }
    return timestamp;
}
exports.validateSnowflake = validateSnowflake;
//# sourceMappingURL=snowflake.js.map