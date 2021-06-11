import { EntityType } from "./EntityType";

export class Entity {
    constructor(type, data) {
        /**
         * @type {EntityType}
         */
        this.type = type;
        /**
         * @type {Object}
         */
        this.entityData = data;
    }
}
