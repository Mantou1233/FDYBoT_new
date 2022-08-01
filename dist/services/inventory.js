"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InventoryManager {
    toDisplay(lang = "en", id) {
        return i18n.parse(lang, `-item.${id}`);
    }
    addItem(inv, id, count = 1) {
        if (inv[id])
            inv[id] += count;
        else
            inv[id] = count;
        return inv;
    }
    removeItem(inv, id, count = 1) {
        inv[id] -= count;
        if (inv[id] < 1)
            delete inv[id];
        return inv;
    }
    deleteItem(inv, id) {
        if (inv[id])
            delete inv[id];
        return inv;
    }
    hasItem(inv, id, count = 1) {
        if (inv[id] && inv[id] >= count)
            return true;
        return false;
    }
}
exports.default = new InventoryManager();
//# sourceMappingURL=inventory.js.map