
class InventoryManager{
    toDisplay(lang = "en", id){
        return i18n.parse(lang, `-item.${id}`).replace("%s", `<:item_wip:945563217067905034> ${id}`);
    }
    addItem(p, id, count = 1) {
        if (p.inv[id]) p.inv[id] += count;
        else p.inv[id] = count;
    }
    removeItem(p, id, count = 1) {
        p.inv[id] -= count;
        if (p.inv[id] < 1) delete p.inv[id];
    }
    deleteItem(p, id) {
        if (p.inv[id]) delete p.inv[id];
    }
    hasItem(p, id, count = 1) {
        if (p.inv[id] && p.inv[id] >= count) return true;
        return false;
    }
}
export default new InventoryManager();

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}
