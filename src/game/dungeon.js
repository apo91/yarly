import { Random } from "random";
import { ENTITY_TYPE } from "./entities";
import { TILE_TYPE } from "./tiles";

const GENERATOR_ACTION = {
    ADD_SEGMENT: 0,
    ADD_LOOP: 1,
};

const randomAction = (rng) =>
    rng.int(0, 1);

const ccw = (ax, ay, bx, by, cx, cy) =>
    (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

const isect = (s1, s2) =>
    ccw(s1[0][0], s1[0][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) != ccw(s1[1][0], s1[1][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) &&
    ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[0][0], s2[0][1]) != ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[1][0], s2[1][1]);

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

/**
 * 
 * @param {Random} rng 
 * @param {*} width 
 * @param {*} height 
 */
export const generateLayoutTiles = (rng, segmentsCount, width, height) => {
    const segments = [
        [[rng.float(), rng.float()], [rng.float(), rng.float()]]
    ];
    while (segments.length < segmentsCount) {
        const action = randomAction(rng);
        const existingSegment = segments[rng.int(0, segments.length - 1)];
        switch (action) {
            case GENERATOR_ACTION.ADD_SEGMENT: {
                const startVertex = existingSegment[rng.int(0, 1)];
                const newSegment = [
                    [startVertex[0], startVertex[1]],
                    [rng.float(), rng.float()]
                ];
                segments.push(newSegment);
                break;
            }
            case GENERATOR_ACTION.ADD_LOOP: {
                const newVertex = [rng.float(), rng.float()];
                const newSegment1 = [existingSegment[0], newVertex];
                const newSegment2 = [existingSegment[1], newVertex];
                segments.push(newSegment1);
                segments.push(newSegment2);
                break;
            }
        }
    }
    const layoutTiles = new Array(width * height);
    layoutTiles.fill(TILE_TYPE.WALL);
    const tw = 1 / width;
    const th = 1 / height;
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const x0 = tw * x;
            const y0 = th * y;
            const xw = x0 + tw;
            const yh = y0 + th;
            for (const segment of segments) {
                if (layoutTiles[i] != TILE_TYPE.EMPTY) {
                    const isCellIntersected =
                        isect(segment, [[x0, y0], [xw, y0]]) ||
                        isect(segment, [[xw, y0], [xw, yh]]) ||
                        isect(segment, [[xw, yh], [x0, yh]]) ||
                        isect(segment, [[x0, yh], [x0, y0]]);
                    if (isCellIntersected) {
                        layoutTiles[i] = TILE_TYPE.EMPTY;
                    }
                }
            }
            i++;
        }
    }
    return layoutTiles;
}

/**
 * 
 * @param {Random} rng 
 * @param {*} layoutTiles 
 * @param {*} entitiesCount 
 */
export const generateEntities = (rng, layoutTiles, entitiesCount) => {
    const emptyTileIndexes = [];
    for (const tileIndex in layoutTiles) {
        if (layoutTiles[tileIndex] === TILE_TYPE.EMPTY) {
            emptyTileIndexes.push(tileIndex);
        }
    }
    const entities = new Array(layoutTiles.length);
    entities.fill(ENTITY_TYPE.NONE)
    shuffle(rng, emptyTileIndexes);
    for (const tileIndex of emptyTileIndexes.slice(0, entitiesCount)) {
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
        entities[tileIndex] = newEntityType;
    }
    return entities;
}
