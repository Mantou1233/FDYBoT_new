export declare const DISCORD_EPOCH = 1420070400000;
export declare function convertSnowflakeToDate(snowflake: any, epoch?: number): Date;
export declare function validateSnowflake(snowflake: any): Date | "That doesn't look like a snowflake. Snowflakes contain only numbers." | "That doesn't look like a snowflake. Snowflakes are much larger numbers." | "That doesn't look like a snowflake. Snowflakes have fewer digits.";
