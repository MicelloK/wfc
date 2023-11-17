

const MAP_SIZE = Number(getComputedStyle(document.documentElement).getPropertyValue('--map-size'));

const MAP_PIECES: { [key: number]: string } = {
    0: "vertical-line",
    1: "horizontal-line",
    2: "top-right-twist",
    3: "top-left-twist",
    4: "bottom-right-twist",
    5: "bottom-left-twist",
    6: "top-fork",
    7: "bottom-fork",
    8: "right-fork",
    9: "left-fork",
};

enum Direction {
    top,
    right,
    bottom,
    left,
}

const COLLAPSE_RULES: { [key: number]: number[] } = {
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


const possibleMapPieces = Object.keys(MAP_PIECES).map((key) => Number(key));

function getNewMap(): number[][][] {
    const map: number[][][] = Array.from({ length: MAP_SIZE }, () =>
        Array.from({ length: MAP_SIZE }, () => 
            [...possibleMapPieces])
    );
    return map;
}

function getOppositeSide(side: Direction): Direction {
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

function getNextCoords(x: number, y: number, side: Direction): [number, number] {
    switch(side) {
        case Direction.top:
            return [x, y - 1];
        case Direction.right:
            return [x + 1, y];
        case Direction.bottom:
            return [x, y + 1];
        case Direction.left:
            return [x - 1, y];
    }
}

function getLowestEntropyElementCoords(map: number[][][]): [number, number] {
    let lowestEntropy = Infinity;
    let lowestEntropyCoords: [number, number] = [0, 0];
    map.forEach((row, y) => {
        row.forEach((element, x) => {
            if (element.length > 1 && element.length < lowestEntropy) {
                lowestEntropy = element.length;
                lowestEntropyCoords = [x, y];
            }
        });
    });
    return lowestEntropyCoords;
}

class WaveFunction {
    map: number[][][];
    constructor(map: number[][][]) {
        this.map = map;
    }

    propagate(coords: [number, number], side: Direction, value: number | null): void {
        // side - side of the element from which the propagation is happening
        const [x, y] = coords;
        let spliced = false;
        
        if(value !== null) {
            this.map[y][x].forEach((element) => {
                if(COLLAPSE_RULES[element][side] != value) {
                    this.map[y][x].splice(this.map[y][x].indexOf(element), 1);
                    spliced = true;
                }
            });
        }
        if(spliced) {
            for(const side in Direction) {
                if(!isNaN(Number(side))) {
                    let remainingValues = new Set<number>();
                    this.map[y][x].forEach((element) => {
                        remainingValues.add(COLLAPSE_RULES[element][side]);
                    });
                    if(remainingValues.size == 1) {
                        let [newX, newY] = getNextCoords(x, y, Number(side));
                        if(newX >= 0 && newY >= 0) {
                            this.propagate(getNextCoords(x, y, Number(side)), getOppositeSide(Number(side)), [...remainingValues][0]);
                        }
                    }
                }
            }
        }
    }

    collapse(coords: [number, number]): number {
        const [x, y] = coords;
        const element = this.map[y][x][Math.floor(Math.random() * this.map[y][x].length)];
        this.map[y][x] = [element];
        return element;
    }

    isFullCollapsed(): boolean {
        let isCollapsed = true;
        this.map.forEach((row) => {
            row.forEach((element) => {
                if(element.length > 1) {
                    isCollapsed = false;
                }
            });
        });
        if(isCollapsed) {
            this.drawMap();
        }
        return isCollapsed;
    }

    run(): void {
        if(!this.isFullCollapsed()) {
            requestAnimationFrame(() => this.run());
        }
        const coords = getLowestEntropyElementCoords(this.map);
        this.collapse(coords);
        this.propagate(coords, Direction.top, null);
    }

    drawMap(): void {
        const mapElement = document.getElementById("map");

        this.map.forEach((row, y) => {
            row.forEach((element, x) => {
                const pieceElement = document.createElement("div");
                pieceElement.style.gridColumnStart = (y+1).toString();
                pieceElement.style.gridRowStart = (x+1).toString();
                pieceElement.classList.add(MAP_PIECES[element[0]]);
                // pieceElement.classList.add("top-fork");
                mapElement?.appendChild(pieceElement);
            });
        });

    }
}

let x = new WaveFunction(getNewMap());
x.run();

