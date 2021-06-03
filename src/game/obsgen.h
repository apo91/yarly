#pragma once

#include "../rng.h"
#include "../math.h"
#include "../data/bits.h"

enum obsgen_action {
    OBSGEN_ADD_SEGMENT = 0,
    OBSGEN_ADD_LOOP    = 1,
};

struct obsgen_segment {
    float x1;
    float y1;
    float x2;
    float y2;
};

static inline
bool obsgen_ccw(float ax, float ay, float bx, float by, float cx, float cy) {
    return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
}

static inline
bool obsgen_isect(const struct obsgen_segment* s1, const struct obsgen_segment* s2) {
    return obsgen_ccw(s1->x1, s1->y1, s2->x1, s2->y1, s2->x2, s2->y2) != obsgen_ccw(s1->x2, s1->y2, s2->x1, s2->y1, s2->x2, s2->y2)
        && obsgen_ccw(s1->x1, s1->y1, s1->x2, s1->y2, s2->x1, s2->y1) != obsgen_ccw(s1->x1, s1->y1, s1->x2, s1->y2, s2->x2, s2->y2);
}

void obsgen_generate(
    struct rng* rng,
    int max_segments,
    int tile_cols,
    int tile_rows,
    struct bits* obstacles_map
) {
    // initialize
    struct obsgen_segment segments[max_segments + 2];
    size_t segments_count = 0;
    // generate initial segment
    struct obsgen_segment* initial_segment = &segments[0];
    for (int i = 0; i < 2; i++) {
        float x, y;
        switch (rng_next_i(rng) % 4) {
            case 0: x = 0.; y = rng_next_f(rng); break;
            case 1: x = 1.; y = rng_next_f(rng); break;
            case 2: x = rng_next_f(rng); y = 0.; break;
            case 3: x = rng_next_f(rng); y = 1.; break;
        }
        if (i == 0) {
            initial_segment->x1 = x;
            initial_segment->y1 = y;
        } else {
            initial_segment->x2 = x;
            initial_segment->y2 = y;
        }
    }
    segments_count = 1;
    // generate rest of segments
    while (segments_count < max_segments) {
        enum obsgen_action action = rng_next_i(rng) % 2;
        struct obsgen_segment* segment =
            &segments[rng_next_i(rng) % segments_count];
        switch (action) {
            case OBSGEN_ADD_SEGMENT: {
                float x = rng_next_f(rng);
                float y = rng_next_f(rng);
                float old_x2 = segment->x2;
                float old_y2 = segment->y2;
                segment->x2 = x;
                segment->y2 = y;
                struct obsgen_segment* new_segment = &segments[segments_count++];
                new_segment->x1 = x;
                new_segment->y1 = y;
                new_segment->x2 = old_x2;
                new_segment->y2 = old_y2;
                break;
            }
            case OBSGEN_ADD_LOOP: {
                float x = rng_next_f(rng);
                float y = rng_next_f(rng);
                struct obsgen_segment* new_segment;
                new_segment = &segments[segments_count++];
                new_segment->x1 = segment->x1;
                new_segment->y1 = segment->y1;
                new_segment->x2 = x;
                new_segment->y2 = y;
                new_segment = &segments[segments_count++];
                new_segment->x1 = segment->x2;
                new_segment->y1 = segment->y2;
                new_segment->x2 = x;
                new_segment->y2 = y;
                break;
            }
        }
    }
    // fill obstacles map
    bits_fill(obstacles_map, 1);
    float tw = 1. / (float)tile_cols;
    float th = 1. / (float)tile_rows;
    int i = 0;
    for (int r = 0; r < tile_rows; r++) {
        for (int c = 0; c < tile_cols; c++) {
            float x0 = tw * c;
            float y0 = th * r;
            float xw = x0 + tw;
            float yh = y0 + th;
            for (int j = 0; j < segments_count; j++) {
                const struct obsgen_segment* segment = &segments[j];
                if (bits_get(obstacles_map, i)) {
                    bits_set(obstacles_map, i, !(
                        obsgen_isect(segment, &(struct obsgen_segment) { x0, y0, xw, y0 }) ||
                        obsgen_isect(segment, &(struct obsgen_segment) { xw, y0, xw, yh }) ||
                        obsgen_isect(segment, &(struct obsgen_segment) { xw, yh, x0, yh }) ||
                        obsgen_isect(segment, &(struct obsgen_segment) { x0, yh, x0, y0 })
                    ));
                }
            }
            i++;
        }
    }
}
