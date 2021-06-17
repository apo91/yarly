import { Consumable } from "./Consumable";
import { ItemType } from "./ItemType";

type ItemOptions = {
    itemType: ItemType;
    weight: number;
    initialName: string;
    identifiedName: string;
}

export class Item {
    itemType: ItemType;
    weight: number;
    initialName: string;
    identifiedName: string;
    constructor(options: ItemOptions) {
        this.itemType = options.itemType;
        this.weight = options.weight;
        this.initialName = options.initialName;
        this.identifiedName = options.identifiedName;
    }
    isConsumable(): this is Consumable {
        return this.itemType === ItemType.Consumable;
    }
}
