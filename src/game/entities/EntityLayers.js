import { Entity } from "./Entity";
import { ENTITY_TYPE } from "./ENTITY_TYPE";
import { ENTITY_TYPE_LAYER_PRIORITY } from "./ENTITY_TYPE_LAYER_PRIORITY";

export class EntityLayers {
    constructor() {
        this.entities = [];
        this.hasCreature = false;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this.entities.length === 0;
    }
    /**
     * @returns {Entity}
     */
    getTopEntity() {
        return this.entities[this.entities.length - 1];
    }
    /**
     * @param {Entity} entity 
     * @returns {boolean}
     */
    hasEntity(entity) {
        return this.entities.includes(entity);
    }
    /**
     * @param {Entity} entity 
     */
    addEntity(entity) {
        if (entity.type === ENTITY_TYPE.CREATURE) {
            if (this.hasCreature) {
                throw new Error("EntityLayers.addEntity - attempt to add creature to the tile where creature is already present!");
            }
            this.hasCreature = true;
        }
        this.entities.push(entity);
        // bubble sort the new entry according to type layer priorities
        for (let i = this.entities.length - 1; i > 0; i--) {
            const shouldBubble =
                ENTITY_TYPE_LAYER_PRIORITY[this.entities[i - 1].type] >
                ENTITY_TYPE_LAYER_PRIORITY[this.entities[i].type];
            if (shouldBubble) {
                const temp = this.entities[i];
                this.entities[i] = this.entities[i - 1];
                this.entities[i - 1] = temp;
            } else {
                return;
            }
        }
    }
    // popEntity() {
    //     if (this.isEmpty()) {
    //         return null;
    //     }
    //     if (this.getTopEntityType() === ENTITY_TYPE.CREATURE) {
    //         this.hasCreature = false;
    //     }
    //     return [this.entityTypeBuffer.pop(), this.entityDataRefBuffer.pop()];
    // }
    /**
     * @param {Entity} entity 
     * @returns {boolean}
     */
    removeEntity(entity) {
        for (const index in this.entities) {
            const entityFromBuffer = this.entities[index];
            if (entityFromBuffer === entity) {
                this.entities.splice(index, 1);
                if (entity.type === ENTITY_TYPE.CREATURE) {
                    this.hasCreature = false;
                }
                return true;
            }
        }
        return false;
    }
}
