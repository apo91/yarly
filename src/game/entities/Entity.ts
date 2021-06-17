import { EntityType } from "./EntityType";
import { Creature } from "../creature";
import { Item } from "../items";

export class Entity<T extends Creature | Item<any>> {
    type: EntityType;
    entityData: T;
    constructor(type: EntityType, data: T) {
        this.type = type;
        this.entityData = data;
    }
    isCreature(): this is Entity<Creature> {
        return this.type === EntityType.Creature;
    }
    isItem(): this is Entity<Item<any>> {
        return this.type === EntityType.Item;
    }
}
