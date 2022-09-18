declare class InventoryManager {
    toDisplay(lang: string | undefined, id: any, raw?: boolean): string;
    getItems(id: any, list?: string[]): string | undefined;
    addItem(p: any, id: any, count?: number): void;
    removeItem(p: any, id: any, count?: number): void;
    deleteItem(p: any, id: any): void;
    hasItem(p: any, id: any, count?: number): boolean;
}
declare const _default: InventoryManager;
export default _default;
