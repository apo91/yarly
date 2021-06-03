import { Random } from "random";
import { TILE_TYPE } from "./tiles";

const GENERATOR_ACTION = {
    ADD_SEGMENT: 0,
    ADD_LOOP: 1,
};

const randomAction = (rng) =>
    rng.int(0, 1);


// static inline
// bool obsgen_ccw(float ax, float ay, float bx, float by, float cx, float cy) {
//     return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
// }

// static inline
// bool obsgen_isect(const struct obsgen_segment* s1, const struct obsgen_segment* s2) {
//     return obsgen_ccw(s1->x1, s1->y1, s2->x1, s2->y1, s2->x2, s2->y2) != obsgen_ccw(s1->x2, s1->y2, s2->x1, s2->y1, s2->x2, s2->y2)
//         && obsgen_ccw(s1->x1, s1->y1, s1->x2, s1->y2, s2->x1, s2->y1) != obsgen_ccw(s1->x1, s1->y1, s1->x2, s1->y2, s2->x2, s2->y2);
// }

const ccw = (ax, ay, bx, by, cx, cy) =>
    (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

const isect = (s1, s2) =>
    ccw(s1[0][0], s1[0][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) != ccw(s1[1][0], s1[1][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) &&
    ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[0][0], s2[0][1]) != ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[1][0], s2[1][1]);

/**
 * 
 * @param {Random} rng 
 * @param {*} width 
 * @param {*} height 
 */
export const generateDungeon = (rng, segmentsCount, width, height) => {
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
    const dungeon = new Array(width * height);
    dungeon.fill(TILE_TYPE.WALL);
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
                if (dungeon[i] != TILE_TYPE.EMPTY) {
                    const isCellIntersected =
                        isect(segment, [[x0, y0], [xw, y0]]) ||
                        isect(segment, [[xw, y0], [xw, yh]]) ||
                        isect(segment, [[xw, yh], [x0, yh]]) ||
                        isect(segment, [[x0, yh], [x0, y0]]);
                    if (isCellIntersected) {
                        dungeon[i] = TILE_TYPE.EMPTY;
                    }
                }
            }
            i++;
        }
    }
    return dungeon;
    // // fill obstacles map
    // bits_fill(obstacles_map, 1);
    // float tw = 1. / (float)tile_cols;
    // float th = 1. / (float)tile_rows;
    // int i = 0;
    // for (int r = 0; r < tile_rows; r++) {
    //     for (int c = 0; c < tile_cols; c++) {
    //         float x0 = tw * c;
    //         float y0 = th * r;
    //         float xw = x0 + tw;
    //         float yh = y0 + th;
    //         for (int j = 0; j < segments_count; j++) {
    //             const struct obsgen_segment* segment = &segments[j];
    //             if (bits_get(obstacles_map, i)) {
    //                 bits_set(obstacles_map, i, !(
    //                     obsgen_isect(segment, &(struct obsgen_segment) { x0, y0, xw, y0 }) ||
    //                     obsgen_isect(segment, &(struct obsgen_segment) { xw, y0, xw, yh }) ||
    //                     obsgen_isect(segment, &(struct obsgen_segment) { xw, yh, x0, yh }) ||
    //                     obsgen_isect(segment, &(struct obsgen_segment) { x0, yh, x0, y0 })
    //                 ));
    //             }
    //         }
    //         i++;
    //     }
    // }

    // const grid = new Array(width * height);
    // for (let x = 0; x < width; x++) {
    //     for (let y = 0; y < height; y++) {            
    //         // grid[y * width + x] = 1;
    //     }
    // }
}
