import { Entity } from "./Entity";
import { EntityType } from "./EntityType";
import { ENTITY_TYPE_LAYER_PRIORITY } from "./constants";

export class EntityLayers {
    constructor() {
        /**
         * @type {Entity[]}
         */
        this.entities = [];
        /**
         * @type {boolean}
         */
        this.hasCreature = false;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this.entities.length === 0;
    }
    /**
     * @returns {Entity | undefined}
     */
    getTopEntity() {
        return this.entities[this.entities.length - 1];
    }
    /**
     * @param {EntityType} type
     * @returns {Entity | undefined}
     */
    getTopEntityOfType(type) {
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[this.entities.length - 1 - i];
            if (entity.type === type) {
                return entity;
            }
        }
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
        if (entity.type === EntityType.Creature) {
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
        for (let i = 0; i < this.entities.length; i++) {
            const entityFromBuffer = this.entities[i];
            if (entityFromBuffer === entity) {
                this.entities.splice(i, 1);
                if (entity.type === EntityType.Creature) {
                    this.hasCreature = false;
                }
                return true;
            }
        }
        return false;
    }
}
