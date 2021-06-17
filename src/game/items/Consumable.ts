import { Random, RNG } from "random";
import { ConsumableType } from "./ConsumableType";
import { Item } from "./Item";
import { ItemType } from "./ItemType";

// export const CONSUMABLE_TYPE = {
//     POTION: 0,
//     FOOD: 1,
// };

// const POTION_COLORS = ["red", "pink", "magenta", "blue", "cyan", "seagreen"];

// const FOOD_STATUSES = ["fresh", "rotten"];

// const FOOD_NAMES = ["banana", "apple", "cheese", "yogurt"];

// const randomElem = (rng, array) =>
//     array[rng.int(0, array.length - 1)];

// const generateNameForType = (rng, consumableType) => {
//     switch (consumableType) {
//         case CONSUMABLE_TYPE.POTION: {
//             return `${randomElem(rng, POTION_COLORS)} potion`;
//         }
//         case CONSUMABLE_TYPE.FOOD: {
//             return `${randomElem(rng, FOOD_STATUSES)} ${randomElem(rng, FOOD_NAMES)}`;
//         }
//         default:
//             throw new Error(`Unknown consumable type ${consumableType}!`);
//     }
// }

type ConsumableOptions = {
    consumableType: ConsumableType;
    weight: number;
    initialName: string;
    identifiedName: string;
};

export class Consumable extends Item {
    consumableType: ConsumableType;
    constructor({ consumableType, ...itemOptions }: ConsumableOptions) {
        super({ itemType: ItemType.Consumable, ...itemOptions });
        this.consumableType = consumableType;
    }
}
