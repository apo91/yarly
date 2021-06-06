import { Creature, CREATURE_TYPE } from "./Creature";
import { Dungeon } from "./Dungeon"
import { ENTITY_TYPE } from "./entities";
import { Entity } from "./entities/Entity";
import { TILE_TYPE } from "./tiles";

/**
 * @param {Entity} entity 
 */
const entityToSymbol = (entity) => {
    console.log("entityToSymbol... ", entity);
    switch (entity.type) {
        case ENTITY_TYPE.CREATURE: {
            /**
             * @type {Creature}
             */
            const creature = entity.data;
            switch (creature.type) {
                case CREATURE_TYPE.PLAYER_HUMAN:
                case CREATURE_TYPE.PLAYER_ELF:
                case CREATURE_TYPE.PLAYER_DWARF:
                    return "@";
                default:
                    return "M";
            }
        };
        case ENTITY_TYPE.ITEM: {
            return "i";
        };
    }
}

const layoutTileToSymbol = (tileType) =>
    tileType === TILE_TYPE.WALL ? "#" : ".";

export class AsciiRenderer {
    constructor() { }
    /**
     * @param {Dungeon} dungeon 
     */
    render(dungeon) {
        const result = [];
        for (let i = 0; i < dungeon.layoutTilesBuffer.length; i++) {
            const entityLayers = dungeon.entityLayersBuffer[i];
            result.push(
                entityLayers.isEmpty()
                    ? layoutTileToSymbol(dungeon.layoutTilesBuffer[i])
                    : entityToSymbol(entityLayers.getTopEntity())
            );
        }
        return result;
    }
}
