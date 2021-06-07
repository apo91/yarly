import EventEmitter from "events";
import { Random } from "random";
import { DIRECTION_OFFSETS } from "../direction";
import { ENTITY_TYPE, EntityLayers } from "../entities";
import { Entity } from "../entities/Entity";
import { TILE_TYPE } from "../tiles";
import { isect, shuffle } from "../utils";
import { LAYOUT_GENERATOR_ACTION } from "./LAYOUT_GENERATOR_ACTION";
import { MOVE_ENTITY_RESULT } from "./MOVE_ENTITY_RESULT";

export class Dungeon extends EventEmitter {
    /**
     * 
     * @param {Random} rng 
     * @param {number} width 
     * @param {number} height 
     * @param {number} layoutSegmentsCount 
     * @param {number} entitiesCount 
     * @param {Entity} player
     */
    constructor(rng, width, height, layoutSegmentsCount, entitiesCount, player) {
        super();
        this.width = width;
        this.height = height;
        const bufferSize = width * height;
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
        this.entryTileIndex = -1;
        this.exitTileIndex = -1;
        this.generateLayout(rng, layoutSegmentsCount);
        this.generateEntities(rng, player, entitiesCount)
    }
    getTile(x, y) {
        return this.layoutTilesBuffer[this.getIndexFromCoords(x, y)];
    }
    getEntity(x, y) {
        return this.entityLayersBuffer[this.getIndexFromCoords(x, y)];
    }
    tryMoveEntity(entity, direction) {
        for (const index in this.entityLayersBuffer) {
            const sourceEntityLayers = this.entityLayersBuffer[index];
            if (sourceEntityLayers.hasEntity(entity)) {
                const [x, y] = this.getCoordsFromIndex(index);
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
                    return [MOVE_ENTITY_RESULT.MOVE_SUCCESS];
                }
            }
        }
        throw new Error("Dungeon.tryMoveEntity: entity not found!");
    }
    getCoordsFromIndex(index) {
        return [index % this.width, Math.floor(index / this.width)];
    }
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
        for (const tileIndex of this.emptyTileIndexes.slice(0, entitiesCount)) {
            this.entityLayersBuffer[tileIndex].addEntity(new Entity(ENTITY_TYPE.ITEM, null));
        }
    }
}
