import { Item } from "./items";

export class Inventory {
    /**
     * @param {number} maxWeight
     */
    constructor(maxWeight) {
        /**
         * @type {number}
         */
        this.maxWeight = maxWeight;
        /**
         * @type {number}
         */
        this.currentWeight = 0;
        /**
         * @type {Map<Item<any>, number>}
         */
        this.itemQuantities = new Map();
    }
    /**
     * @template T
     * @param {(item: Item<any>, quantity: number) => T} fn
     * @returns {T[]}
     */
    map(fn) {
        return Array.from(this.itemQuantities.entries(),
            ([item, quantity]) => fn(item, quantity)
        );
    }
    /**
     * @returns {number}
     */
    getRemainingWeight() {
        return this.maxWeight - this.currentWeight;
    }
    /**
     * @param {Item} item
     * @returns {boolean}
     */
    tryAddItem(item) {
        if (this.getRemainingWeight() < item.weight) {
            return false;
        } else {
            const quantity = this.itemQuantities.get(item) || 0;
            this.itemQuantities.set(item, quantity + 1);
            this.currentWeight += item.weight;
            return true;
        }
    }
    /**
     * @param {Item} item
     * @param {number} quantity
     */
    removeItem(item, quantity) {
        const currentQuantity = this.itemQuantities.get(item);
        if (currentQuantity) {
            if (quantity >= currentQuantity) {
                this.itemQuantities.delete(item);
            } else {
                this.itemQuantities.set(item, currentQuantity - quantity);
            }
            this.currentWeight -= item.weight * quantity;
        }
    }
}
