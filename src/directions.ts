export enum Direction {
    top,
    right,
    bottom,
    left,
}

export const DIRECTIONS = [Direction.top, Direction.right, Direction.bottom, Direction.left];

export function getOppositeSide(side: Direction): Direction {
    switch(side) {
        case Direction.top:
            return Direction.bottom;
        case Direction.right:
            return Direction.left;
        case Direction.bottom:
            return Direction.top;
        case Direction.left:
            return Direction.right;
    }
}

export function getNextCoords(x: number, y: number, side: Direction): [number, number] {
    switch(side) {
        case Direction.top:
            return [x - 1 , y];
        case Direction.right:
            return [x, y + 1];
        case Direction.bottom:
            return [x + 1, y];
        case Direction.left:
            return [x, y - 1];
    }
}