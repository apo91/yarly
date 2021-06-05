import { Random } from "random";
import { Entity } from "./entities";
import { ENTITY_TYPE } from "./entities";
import { TILE_TYPE } from "./tiles";

/**
 * 
 * @param {Random} rng 
 * @param {*} array 
 */
const shuffle = (rng, array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

const LAYOUT_GENERATOR_ACTION = {
    ADD_SEGMENT: 0,
    ADD_LOOP: 1,
};

const ccw = (ax, ay, bx, by, cx, cy) =>
    (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

const isect = (s1, s2) =>
    ccw(s1[0][0], s1[0][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) != ccw(s1[1][0], s1[1][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) &&
    ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[0][0], s2[0][1]) != ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[1][0], s2[1][1]);


export class Dungeon {
    /**
     * 
     * @param {Random} rng 
     * @param {number} width 
     * @param {number} height 
     * @param {number} layoutSegmentsCount 
     * @param {number} entitiesCount 
     * @param {Creature} player
     */
    constructor(rng, width, height, layoutSegmentsCount, entitiesCount, player) {
        this.width = width;
        this.height = height;
        const bufferSize = width * height;
        this.layoutTilesBuffer = new Array(bufferSize);
        this.entitiesBuffer = new Array(bufferSize);
        this.emptyTileIndexes = [];
        this.entryTileIndex = -1;
        this.exitTileIndex = -1;
        this.generateLayout(rng, layoutSegmentsCount);
        this.generateEntities(rng, entitiesCount)
    }
    getTile(x, y) {
        return this.layoutTilesBuffer[y * this.width + x];
    }
    getEntityAt(x, y) {
        return this.entitiesBuffer[y * this.width + x];
    }
    removeEntity(entity) { }
    /**
     * 
     * @param {Random} rng
     * @param {number} segmentsCount 
     * @param {number} width 
     * @param {number} height
     * @returns {Dungeon}
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
     * @param {Creature} player
     * @param {number} entitiesCount 
     */
    generateEntities = (rng, player, entitiesCount) => {
        this.entitiesBuffer.fill(ENTITY_TYPE.NONE)
        this.entitiesBuffer[this.entryTileIndex] = new Entity(ENTITY_TYPE.PLAYER, player);
        for (const tileIndex of this.emptyTileIndexes.slice(0, entitiesCount)) {
            let newEntityType = ENTITY_TYPE.NONE;
            switch (rng.int(0, 2)) {
                case 0:
                    newEntityType = ENTITY_TYPE.ENEMY;
                    break;
                case 1:
                    newEntityType = ENTITY_TYPE.POTION;
                    break;
                case 2:
                    newEntityType = ENTITY_TYPE.GOLD;
                    break;
                default:
                    throw new Error("Unhandled switch case in generateEntities!");
            }
            this.entitiesBuffer[tileIndex] = new Entity(newEntityType, null);
        }
    }
}
