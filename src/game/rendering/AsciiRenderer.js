import React from "react";
import { Creature, CreatureType } from "../creature";
import { Dungeon } from "../dungeon";
import { Entity, EntityLayers } from "../entities";
import { EntityType } from "../entities/EntityType";
import { TileType } from "../TileType";
import { RenderedTile, TilesContainer } from "./AsciiRenderer.styled";
import "./ViewportConfig";

/**
 * @param {Entity} entity
 * @returns {string}
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

/**
 * @param {TileType} tileType
 * @returns {string}
 */
const tileTypeSymbol = (tileType) => {
    switch (tileType) {
        case TileType.Wall:
            return "#";
        case TileType.Entry:
            return "<";
        case TileType.Exit:
            return ">";
        case TileType.Empty:
            return ".";
        default:
            throw new Error(`Unknown tile type ${tileType}!`);
    }
};

/**
 * @param {TileType} tileType
 * @param {EntityLayers} entityLayers
 * @returns {string}
 */
const tileSymbol = (tileType, entityLayers) => {
    if (entityLayers.isEmpty()) {
        return tileTypeSymbol(tileType);
    } else {
        const topEntity = entityLayers.getTopEntity();
        return topEntity ? entitySymbol(topEntity) : "";
    }
}

/**
 * @param {TileType} tileType
 * @param {EntityLayers} entityLayers
 * @returns {string}
 */
const tileForegroundColor = (tileType, entityLayers) => {
    if (entityLayers.isEmpty()) {
        switch (tileType) {
            case TileType.Empty:
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
