export const ANIMATION_DELAY = 20;

export const COLLAPSE_RULES: { [key: number]: number[] } = {
    0: [0, 1, 0, 1], // top, right, bottom, left
    1: [1, 0, 1, 0],
    2: [1, 1, 0, 0],
    3: [1, 0, 0, 1],
    4: [0, 1, 1, 0],
    5: [0, 0, 1, 1],
    6: [1, 1, 0, 1],
    7: [0, 1, 1, 1],
    8: [1, 1, 1, 0],
    9: [1, 0, 1, 1],
};

enum MapPieces {
    verticalLine,
    horizontalLine,
    topRightTwist,
    topLeftTwist,
    bottomRightTwist,
    bottomLeftTwist,
    topFork,
    bottomFork,
    rightFork,
    leftFork,
}

export const MAP_PIECES = Object.values(MapPieces).filter(value => typeof value === 'number') as number[];

