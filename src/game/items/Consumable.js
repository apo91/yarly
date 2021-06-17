import { Random, RNG } from "random";

export const CONSUMABLE_TYPE = {
    POTION: 0,
    FOOD: 1,
};

const POTION_COLORS = ["red", "pink", "magenta", "blue", "cyan", "seagreen"];

const FOOD_STATUSES = ["fresh", "rotten"];

const FOOD_NAMES = ["banana", "apple", "cheese", "yogurt"];

const randomElem = (rng, array) =>
    array[rng.int(0, array.length - 1)];

const generateNameForType = (rng, consumableType) => {
    switch (consumableType) {
        case CONSUMABLE_TYPE.POTION: {
            return `${randomElem(rng, POTION_COLORS)} potion`;
        }
        case CONSUMABLE_TYPE.FOOD: {
            return `${randomElem(rng, FOOD_STATUSES)} ${randomElem(rng, FOOD_NAMES)}`;
        }
        default:
            throw new Error(`Unknown consumable type ${consumableType}!`);
    }
}

export class Consumable {
    /**
     * @param {Random} rng
     */
    constructor(rng) {
        this.type = rng.int(0, 1);
        this.name = generateNameForType(rng, this.type);
    }
}
