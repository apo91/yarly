export const DIRECTION = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
    NORTH_EAST: 4,
    SOUTH_EAST: 5,
    SOUTH_WEST: 6,
    NORTH_WEST: 7,
};

export const DIRECTION_OFFSETS = {
    [DIRECTION.NORTH]: [0, -1],
    [DIRECTION.EAST]: [1, 0],
    [DIRECTION.SOUTH]: [0, 1],
    [DIRECTION.WEST]: [-1, 0],
    [DIRECTION.NORTH_EAST]: [1, -1],
    [DIRECTION.SOUTH_EAST]: [1, 1],
    [DIRECTION.SOUTH_WEST]: [-1, 1],
    [DIRECTION.NORTH_WEST]: [-1, -1],
};
