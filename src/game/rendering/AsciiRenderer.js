import React from "react";
import { Creature, CreatureType } from "../creature";
import { Dungeon } from "../dungeon";
import { Entity, EntityLayers } from "../entities";
import { EntityType } from "../entities/EntityType";
import { TILE_TYPE } from "../tiles";
import { RenderedTile, TilesContainer } from "./AsciiRenderer.styled";
import "./ViewportConfig";

/**
 * @param {Entity} entity
 */
const entitySymbol = (entity) => {
    switch (entity.type) {
        case EntityType.Creature: {
            /**
             * @type {Creature}
             */
            const creature = entity.entityData;
            switch (creature.type) {
                case CreatureType.PlayerHuman:
                case CreatureType.PlayerElf:
                case CreatureType.PlayerDwarf:
                    return "@";
                default:
                    return "M";
            }
        };
        case EntityType.Item: {
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
        switch (topEntity?.type) {
            case EntityType.Creature:
                return "rgba(255, 128, 255, 0.75)";
            case EntityType.Item:
                return "rgba(128, 128, 255, 0.75)";
            default:
                throw new Error(`Unknown entity type ${topEntity?.type}!`);
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
