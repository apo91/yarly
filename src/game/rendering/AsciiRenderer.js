import { Creature, CREATURE_TYPE } from "../Creature";
import { Dungeon } from "../dungeon";
import { ENTITY_TYPE } from "../entities";
import { Entity } from "../entities/Entity";
import { TILE_TYPE } from "../tiles";
// import react from 'react';

const RenderedTile = ({ tilesPerRow, symbol, ...props }) =>
    <div
        style={{
            width: (100 / tilesPerRow) + "%",
            boxSizing: "border-box",
        }}
        {...props}
    >
        {symbol}
    </div>;

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
    /**
     * @param {ViewportConfig} viewportConfig
     */
    constructor(viewportConfig) {
        this.viewportWidth = viewportConfig.width;
        this.viewportHeight = viewportConfig.height;
    }
    /**
     * @param {Dungeon} dungeon
     */
    render(dungeon) {
        // todo render viewport based on dungeon.player & vwwidth & vwheight
        const [playerX, playerY] = dungeon.getEntityCoords(dungeon.player);
        const x0 = Math.max(0, playerX - Math.floor(this.viewportWidth / 2));
        const y0 = Math.max(0, playerY - Math.floor(this.viewportHeight / 2));
        const result = [];
        for (let dy = 0; dy < this.viewportHeight; dy++) {
            for (let dx = 0; dx < this.viewportWidth; dx++) {
                const tileIndex = dungeon.getIndexFromCoords(x0 + dx, y0 + dy);
                const entityLayers = dungeon.entityLayersBuffer[tileIndex];
                result.push(
                    <RenderedTile
                        key={dy * this.viewportWidth + dx}
                        tilesPerRow={this.viewportWidth}
                        symbol={
                            entityLayers.isEmpty()
                                ? layoutTileToSymbol(dungeon.layoutTilesBuffer[tileIndex])
                                : entityToSymbol(entityLayers.getTopEntity())
                        }
                    />
                );
            }
        }
        return result;
        // {viewportHtml.map((symbol, i) =>
        //     <RenderedTile
        //       key={i}
        //       symbol={symbol}
        //     />
        //   )}
    }
}
