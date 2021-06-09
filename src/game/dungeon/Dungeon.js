import EventEmitter from "events";
import { Random } from "random";
import { Consumable } from "../Consumable";
import { DIRECTION_OFFSETS } from "../direction";
import { ENTITY_TYPE, EntityLayers } from "../entities";
import { Entity } from "../entities/Entity";
import { Item, ITEM_TYPE } from "../Item";
import { TILE_TYPE } from "../tiles";
import { isect, shuffle } from "../utils";
import { LAYOUT_GENERATOR_ACTION } from "./LAYOUT_GENERATOR_ACTION";
import { MOVE_ENTITY_RESULT } from "./MOVE_ENTITY_RESULT";

/**
 * @typedef {Object} DungeonConfig
 * @property {number} width
 * @property {number} height
 * @property {number} layoutSegmentsCount
 * @property {number} entitiesCount
 */

export class Dungeon extends EventEmitter {
    /**
     * @param {Random} rng
     * @param {Entity} player
     * @param {DungeonConfig} config
     */
    constructor(rng, player, config) {
        super();
        this.width = config.width;
        this.height = config.height;
        const bufferSize = config.width * config.height;
        /**
         * @type {number[]}
         */
        this.layoutTilesBuffer = new Array(bufferSize);
        /**
         * @type {EntityLayers[]}
         */
        this.entityLayersBuffer = new Array(bufferSize);
        /**
         * @type {number[]}
         */
        this.emptyTileIndexes = [];
        /**
         * @type {Map<Entity,number>}
         */
        this.tileIndexByEntityRef = new Map();
        this.entryTileIndex = -1;
        this.exitTileIndex = -1;
        this.player = player;
        this.generateLayout(rng, config.layoutSegmentsCount);
        this.generateEntities(rng, player, config.entitiesCount)
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    getTile(x, y) {
        return this.layoutTilesBuffer[this.getIndexFromCoords(x, y)];
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {EntityLayers}
     */
    getEntityLayers(x, y) {
        return this.entityLayersBuffer[this.getIndexFromCoords(x, y)];
    }
    /**
     * @param {Entity} entity
     * @returns {[number, number]}
     */
    getEntityCoords(entity) {
        return this.getCoordsFromIndex(this.tileIndexByEntityRef.get(entity));
    }
    /**
     *
     * @param {Entity} entity
     * @param {number} direction
     * @returns {[number, ...any]}
     */
    tryMoveEntity(entity, direction) {
        const sourceTileIndex = this.tileIndexByEntityRef.get(entity);
        const sourceEntityLayers = this.entityLayersBuffer[sourceTileIndex];
        const [x, y] = this.getCoordsFromIndex(sourceTileIndex);
        const [dx, dy] = DIRECTION_OFFSETS[direction];
        const newX = x + dx;
        const newY = y + dy;
        const isOutOfBounds =
            newX < 0 || newX >= this.width ||
            newY < 0 || newY >= this.height;
        if (isOutOfBounds)
            return [MOVE_ENTITY_RESULT.MOVE_INTO_OBSTACLE];
        const newTileIndex = this.getIndexFromCoords(newX, newY);
        const targetEntityLayers = this.entityLayersBuffer[newTileIndex];
        if (this.layoutTilesBuffer[newTileIndex] === TILE_TYPE.WALL) {
            return [MOVE_ENTITY_RESULT.MOVE_INTO_OBSTACLE];
        } else if (entity.type === ENTITY_TYPE.CREATURE && targetEntityLayers.hasCreature) {
            return [MOVE_ENTITY_RESULT.MOVE_INTO_CREATURE, targetEntityLayers.getTopEntity()];
        } else {
            sourceEntityLayers.removeEntity(entity);
            targetEntityLayers.addEntity(entity);
            this.tileIndexByEntityRef.set(entity, newTileIndex);
            return [MOVE_ENTITY_RESULT.MOVE_SUCCESS];
        }
    }
    /**
     * @param {number} index
     * @returns {[number, number]}
     */
    getCoordsFromIndex(index) {
        return [index % this.width, Math.floor(index / this.width)];
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    getIndexFromCoords(x, y) {
        return y * this.width + x;
    }
    removeEntity(entity) { }
    /**
     *
     * @param {Random} rng
     * @param {number} segmentsCount
     */
    generateLayout = (rng, segmentsCount) => {
        const segments = [
            [[rng.float(), rng.float()], [rng.float(), rng.float()]]
        ];
        while (segments.length < segmentsCount) {
            const existingSegment = segments[rng.int(0, segments.length - 1)];
            switch (rng.int(0, 1)) {
                case LAYOUT_GENERATOR_ACTION.ADD_SEGMENT: {
                    const startVertex = existingSegment[rng.int(0, 1)];
                    const newSegment = [
                        [startVertex[0], startVertex[1]],
                        [rng.float(), rng.float()]
                    ];
                    segments.push(newSegment);
                    break;
                }
                case LAYOUT_GENERATOR_ACTION.ADD_LOOP: {
                    const newVertex = [rng.float(), rng.float()];
                    const newSegment1 = [existingSegment[0], newVertex];
                    const newSegment2 = [existingSegment[1], newVertex];
                    segments.push(newSegment1);
                    segments.push(newSegment2);
                    break;
                }
            }
        }
        this.layoutTilesBuffer.fill(TILE_TYPE.WALL);
        const tw = 1 / this.width;
        const th = 1 / this.height;
        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const x0 = tw * x;
                const y0 = th * y;
                const xw = x0 + tw;
                const yh = y0 + th;
                for (const segment of segments) {
                    if (this.layoutTilesBuffer[i] != TILE_TYPE.EMPTY) {
                        const isCellIntersected =
                            isect(segment, [[x0, y0], [xw, y0]]) ||
                            isect(segment, [[xw, y0], [xw, yh]]) ||
                            isect(segment, [[xw, yh], [x0, yh]]) ||
                            isect(segment, [[x0, yh], [x0, y0]]);
                        if (isCellIntersected) {
                            this.layoutTilesBuffer[i] = TILE_TYPE.EMPTY;
                            this.emptyTileIndexes.push(i);
                        }
                    }
                }
                i++;
            }
        }
        shuffle(rng, this.emptyTileIndexes);
        this.entryTileIndex = this.emptyTileIndexes.pop();
        this.exitTileIndex = this.emptyTileIndexes.pop();
        this.layoutTilesBuffer[this.entryTileIndex] = TILE_TYPE.ENTRY;
        this.layoutTilesBuffer[this.exitTileIndex] = TILE_TYPE.EXIT;
    }
    /**
     *
     * @param {Random} rng
     * @param {Entity} player
     * @param {number} entitiesCount
     */
    generateEntities = (rng, player, entitiesCount) => {
        for (let i = 0; i < this.entityLayersBuffer.length; i++) {
            this.entityLayersBuffer[i] = new EntityLayers();
        }
        this.entityLayersBuffer[this.entryTileIndex].addEntity(player);
        this.tileIndexByEntityRef.set(player, this.entryTileIndex);
        for (const tileIndex of this.emptyTileIndexes.slice(0, entitiesCount)) {
            const entity = new Entity(ENTITY_TYPE.ITEM,
                new Item(ITEM_TYPE.CONSUMABLE, new Consumable(rng))
            );
            this.tileIndexByEntityRef.set(entity, tileIndex);
            this.entityLayersBuffer[tileIndex].addEntity(entity);
        }
    }
}
