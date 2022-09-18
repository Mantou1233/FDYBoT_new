declare const _default: {
    use: {
        bundle: (msg: any, p: any) => Promise<void>;
    };
    equip: {
        fishing_rod: {
            add: (msg: any, p: any) => Promise<void>;
            remove: (msg: any, p: any) => Promise<void>;
        };
    };
    buy: {
        paketa: ShopData;
    };
};
export default _default;
export type ShopData = {
    /**
     * @returns [price, DisplayName, Desc, isBlacklisted]
     */
    view: (count?: number) => [number, string, string, boolean];
};
