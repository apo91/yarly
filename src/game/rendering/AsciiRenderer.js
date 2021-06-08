import React from "react";
import { Creature, CREATURE_TYPE } from "../Creature";
import { Dungeon } from "../dungeon";
import { EntityLayers, ENTITY_TYPE } from "../entities";
import { Entity } from "../entities/Entity";
import { TILE_TYPE } from "../tiles";
import { RenderedTile, TilesContainer } from "./AsciiRenderer.styled";

/**
 * @param {Entity} entity
 */
const entitySymbol = (entity) => {
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

const tileTypeSymbol = (tileType) => {
    switch (tileType) {
        case TILE_TYPE.WALL:
            return "#";
        case TILE_TYPE.ENTRY:
            return "<";
        case TILE_TYPE.EXIT:
            return ">";
        case TILE_TYPE.EMPTY:
            return ".";
        default:
            throw new Error(`Unknown tile type ${tileType}!`);
    }
};

const tileSymbol = (layoutTile, entityLayers) => {
    return entityLayers.isEmpty()
        ? tileTypeSymbol(layoutTile)
        : entitySymbol(entityLayers.getTopEntity());
}

/**
 *
 * @param {number} layoutTile
 * @param {EntityLayers} entityLayers
 */
const tileForegroundColor = (layoutTile, entityLayers) => {
    if (entityLayers.isEmpty()) {
        switch (layoutTile) {
            case TILE_TYPE.EMPTY:
                return "rgba(255, 255, 255, 0.75)";
            default:
                return "rgba(255, 255, 255, 1)";
        }
    } else {
        const topEntity = entityLayers.getTopEntity();
        switch (topEntity.type) {
            case ENTITY_TYPE.CREATURE:
                return "rgba(255, 128, 255, 0.75)";
            case ENTITY_TYPE.ITEM:
                return "rgba(128, 128, 255, 0.75)";
            default:
                throw new Error(`Unknown entity type ${topEntity.type}!`);
        }
    }
};

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
                            color={"white"}
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
                            color={tileForegroundColor(layoutTile, entityLayers)}
                        >
                            {tileSymbol(layoutTile, entityLayers)}
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
