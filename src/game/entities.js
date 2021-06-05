export const ENTITY_TYPE = {
    NONE: 0,
    PLAYER: 1,
    ENEMY: 2,
    POTION: 3,
    GOLD: 4,
};

export class Entity {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
