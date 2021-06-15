import { Consumable } from "../Consumable";
import { ItemType } from "./ItemType";

export class Item<T> {
    type: ItemType;
    weight: number;
    itemData: T;
    constructor(type: ItemType, weight: number, data: T) {
        this.type = type;
        this.weight = weight;
        this.itemData = data;
    }
    isConsumable(): this is Item<Consumable> {
        return this.type === ItemType.Consumable;
    }
}
