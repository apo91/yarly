import React from "react";
import { Noise } from "noisejs";
import { Creature, CreatureType } from "../creature";
import { Dungeon } from "../dungeon";
import { Entity, EntityLayers } from "../entities";
import { EntityType } from "../entities/EntityType";
import { TileType } from "../TileType";
import { RenderedTile, TilesContainer } from "./AsciiRenderer.styled";
import "./ViewportConfig";
import { Random } from "random";
import { fbm } from "../utils";

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
 * @param {EntityLayers} [entityLayers]
 * @returns {string}
 */
const tileSymbol = (tileType, entityLayers) => {
    if (!entityLayers || entityLayers.isEmpty()) {
        return tileTypeSymbol(tileType);
    } else {
        const topEntity = entityLayers.getTopEntity();
        return topEntity ? entitySymbol(topEntity) : "";
    }
}

/**
 * @param {TileType} tileType
 * @param {EntityLayers} [entityLayers]
 * @returns {string}
 */
const tileForegroundColor = (tileType, entityLayers) => {
    if (!entityLayers || entityLayers.isEmpty()) {
        switch (tileType) {
            case TileType.Empty:
                return "rgba(255, 255, 255, 0.15)";
            default:
                return "rgba(255, 255, 255, 0.25)";
        }
    } else {
        const topEntity = entityLayers?.getTopEntity();
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
     * @param {Random} rng
     * @param {Dungeon} dungeon
     * @param {ViewportConfig} viewportConfig
     */
    constructor(rng, dungeon, viewportConfig) {
        this.dungeon = dungeon;
        this.viewportWidth = viewportConfig.width;
        this.viewportHeight = viewportConfig.height;
        this.wallBackgroundGradient = [0, 0, 0];
        this.tilesCacheOffsetX = Math.floor(this.viewportWidth / 2);
        this.tilesCacheOffsetY = Math.floor(this.viewportHeight / 2);
        this.tilesCacheWidth = this.dungeon.width + viewportConfig.width;
        this.tilesCacheHeight = this.dungeon.height + viewportConfig.height;
        this.tilesCache = new Array(this.tilesCacheWidth * this.tilesCacheHeight);
        this.noise = new Noise(rng.next());
        this.generateColours(rng);
        this.prerender();
    }
    /**
     * @param {Random} rng
     */
    generateColours = (rng) => {
        const randomGradient = [rng.next(), rng.next(), rng.next()];
        const randomGradientLength = Math.sqrt(randomGradient.reduce((acc, x) => acc + x * x, 0));
        this.wallBackgroundGradient = randomGradient.map(x => x / randomGradientLength);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} includeEntities
     */
    renderTile(x, y, includeEntities) {
        const isOutOfBounds = this.isOutOfBounds(x, y);
        const tileIndex = this.dungeon.getIndexFromCoords(x, y);
        const isWall = isOutOfBounds ||
            this.dungeon.layoutTilesBuffer[tileIndex] === TileType.Wall;
        let bgColor = "default";
        if (isWall) {
            const nx = x / this.dungeon.width;
            const ny = y / this.dungeon.height;
            const z = fbm(3, 11.29, 0.51, nx, ny, (x, y) => (1 + this.noise.perlin2(x, y)) / 2);
            const grad = this.wallBackgroundGradient;
            const r = z * grad[0] * 255;
            const g = z * grad[1] * 255;
            const b = z * grad[2] * 255;
            bgColor = `rgb(${r}, ${g}, ${b})`;
        }
        if (isOutOfBounds) {
            return (
                <RenderedTile
                    key={y * this.viewportWidth + x}
                    tilesPerRow={this.viewportWidth}
                    color={tileForegroundColor(TileType.Wall)}
                    backgroundColor={bgColor}
                >
                    #
                </RenderedTile>
            );
        } else {
            const layoutTile = this.dungeon.layoutTilesBuffer[tileIndex];
            const entityLayers = this.dungeon.entityLayersBuffer[tileIndex];
            return (
                <RenderedTile
                    key={y * this.viewportWidth + x}
                    tilesPerRow={this.viewportWidth}
                    color={
                        includeEntities
                            ? tileForegroundColor(layoutTile, entityLayers)
                            : tileForegroundColor(layoutTile)
                    }
                    backgroundColor={bgColor}
                >
                    {
                        includeEntities
                            ? tileSymbol(layoutTile, entityLayers)
                            : tileSymbol(layoutTile)
                    }
                </RenderedTile>
            );
        }
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isOutOfBounds(x, y) {
        return x < 0 || x >= this.dungeon.width
            || y < 0 || y >= this.dungeon.height;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isStatic(x, y) {
        if (this.isOutOfBounds(x, y)) {
            return true;
        } else {
            const tileIndex = this.dungeon.getIndexFromCoords(x, y);
            const entityLayers = this.dungeon.entityLayersBuffer[tileIndex];
            return entityLayers.isEmpty();
        }
    }
    prerender() {
        for (let dy = 0; dy < this.tilesCacheHeight; dy++) {
            for (let dx = 0; dx < this.tilesCacheWidth; dx++) {
                const x = -this.tilesCacheOffsetX + dx;
                const y = -this.tilesCacheOffsetY + dy;
                const renderedTile = this.renderTile(x, y, false);
                const cacheIndex = dy * this.tilesCacheWidth + dx;
                this.tilesCache[cacheIndex] = renderedTile;
            }
        }
    }
    render() {
        const [playerX, playerY] = this.dungeon.getEntityCoords(this.dungeon.player);
        const x0 = playerX - Math.floor(this.viewportWidth / 2);
        const y0 = playerY - Math.floor(this.viewportHeight / 2);
        const tiles = [];
        for (let dy = 0; dy < this.viewportHeight; dy++) {
            for (let dx = 0; dx < this.viewportWidth; dx++) {
                const x = x0 + dx;
                const y = y0 + dy;
                if (this.isStatic(x, y)) {
                    const cacheIndex = (this.tilesCacheOffsetY + y) * this.tilesCacheWidth + (this.tilesCacheOffsetX + x);
                    const cachedValue = this.tilesCache[cacheIndex];
                    tiles.push(cachedValue);
                } else {
                    tiles.push(this.renderTile(x, y, true));
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
