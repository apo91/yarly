export enum Direction {
    North = "NORTH",
    East = "EAST",
    South = "SOUTH",
    West = "WEST",
    NorthEast = "NORTH_EAST",
    SouthEast = "SOUTH_EAST",
    SouthWest = "SOUTH_WEST",
    NorthWest = "NORTH_WEST",
};

export const DIRECTION_OFFSETS: { [key in Direction]: [number, number] } = {
    [Direction.North]: [0, -1],
    [Direction.East]: [1, 0],
    [Direction.South]: [0, 1],
    [Direction.West]: [-1, 0],
    [Direction.NorthEast]: [1, -1],
    [Direction.SouthEast]: [1, 1],
    [Direction.SouthWest]: [-1, 1],
    [Direction.NorthWest]: [-1, -1],
};
