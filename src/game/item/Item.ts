import { Consumable } from "../Consumable";
import { ItemType } from "./ItemType";

export class Item<T> {
    type: ItemType;
    itemData: T;
    constructor(type: ItemType, data: T) {
        this.type = type;
        this.itemData = data;
    }
    isConsumable(): this is Item<Consumable> {
        return this.type === ItemType.Consumable;
    }
}
