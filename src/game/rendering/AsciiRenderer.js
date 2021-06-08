import React from "react";
import { Creature, CREATURE_TYPE } from "../Creature";
import { Dungeon } from "../dungeon";
import { ENTITY_TYPE } from "../entities";
import { Entity } from "../entities/Entity";
import { TILE_TYPE } from "../tiles";
import { RenderedTile, TilesContainer } from "./AsciiRenderer.styled";

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

const layoutTileOpacity = (tileType) =>
    tileType === TILE_TYPE.WALL ? 1 : 0.5;

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
        const [playerX, playerY] = dungeon.getEntityCoords(dungeon.player);
        const x0 = playerX - Math.floor(this.viewportWidth / 2);
        const y0 = playerY - Math.floor(this.viewportHeight / 2);
        const tiles = [];
        for (let dy = 0; dy < this.viewportHeight; dy++) {
            for (let dx = 0; dx < this.viewportWidth; dx++) {
                const x = x0 + dx;
                const y = y0 + dy;
                const outOfBounds =
                    x < 0 || x >= dungeon.width ||
                    y < 0 || y >= dungeon.height;
                if (outOfBounds) {
                    tiles.push(
                        <RenderedTile
                            key={dy * this.viewportWidth + dx}
                            tilesPerRow={this.viewportWidth}
                            opacity={1}
                        >
                            #
                        </RenderedTile>
                    );
                } else {
                    const tileIndex = dungeon.getIndexFromCoords(x, y);
                    const layoutTile = dungeon.layoutTilesBuffer[tileIndex];
                    const entityLayers = dungeon.entityLayersBuffer[tileIndex];
                    tiles.push(
                        <RenderedTile
                            key={dy * this.viewportWidth + dx}
                            tilesPerRow={this.viewportWidth}
                            opacity={
                                entityLayers.isEmpty()
                                    ? layoutTileOpacity(layoutTile)
                                    : 1
                            }
                        >
                            {entityLayers.isEmpty()
                                ? layoutTileToSymbol(layoutTile)
                                : entityToSymbol(entityLayers.getTopEntity())}
                        </RenderedTile>
                    );
                }
            }
        }
        return (
            <TilesContainer>
                {tiles}
            </TilesContainer>
        );
    }
}
