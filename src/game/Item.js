export const ITEM_TYPE = {
    CONSUMABLE: 0,
    WEAPON: 1,
};

export class Item {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
