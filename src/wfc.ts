



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

class MapElement {
    possiblePieces;
    collapsedPiece: number;
    constructor(possibleMapPieces: number[]) {
        this.possiblePieces = new Set<number>(possibleMapPieces);
        this.collapsedPiece = -1;
    }

    getEntropy(): number {
        return this.possiblePieces.size;
    }

    isCollapsed(): boolean {
        return this.collapsedPiece != -1;
    }

    drawPiece(): void {
        const randomPiece = [...this.possiblePieces][Math.floor(Math.random() * this.possiblePieces.size)];
        this.collapsedPiece = randomPiece;
        console.log("random!!!");
    }

    deletePiece(piece: number): void {
        this.possiblePieces.delete(piece);
        if(this.possiblePieces.size == 1) {
            console.log("aaaaaaaaaaaaa");
            this.drawPiece();
        }
    }

    getRemainingValues(side: Direction): Set<number> {
        const remainingValues = new Set<number>();

        if(this.isCollapsed()) {
            remainingValues.add(COLLAPSE_RULES[this.collapsedPiece][side])
        }
        else {
            [...this.possiblePieces].forEach((piece) => {
                remainingValues.add(COLLAPSE_RULES[piece][side]);
            });
        }
      
        return remainingValues;
    }

    removeValues(value: number, side: Direction, collapseRules: { [key: number]: number[] }): boolean {
        let removed = false;
        [...this.possiblePieces].forEach((piece) => {
            if(collapseRules[piece][side] != value) {
                this.deletePiece(piece);
                removed = true;
            }
        });
        return removed;
    }
}


class GameMap {
    MAP_SIZE = Number(getComputedStyle(document.documentElement).getPropertyValue('--map-size'));

    MAP_PIECES: { [key: number]: string } = {
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

    map: MapElement[][];

    constructor() {
        const possibleMapPieces = Object.keys(this.MAP_PIECES).map((key) => Number(key));

        this.map = Array.from({ length: this.MAP_SIZE }, () =>
            Array.from({ length: this.MAP_SIZE }, () => 
                new MapElement(possibleMapPieces))
        );
    }

    getLowestEntropyElementCoords(): [number, number] {
        let lowestEntropy = Infinity;
        let lowestEntropyCoords: number[][] = []
        this.map.forEach((row, y) => {
            row.forEach((element, x) => {
                if(!element.isCollapsed() && element.getEntropy() == lowestEntropy) {
                    lowestEntropyCoords.push([x, y]);
                }
                if(!element.isCollapsed() && element.getEntropy() < lowestEntropy) {
                    lowestEntropyCoords = [];
                    lowestEntropy = element.getEntropy();
                    lowestEntropyCoords.push([x, y])
                }
            });
        });
        const [x, y] = lowestEntropyCoords[Math.floor(Math.random() * lowestEntropyCoords.length)];
        return [x, y];
    }

    drawPieceOnCoords(coords: [number, number]): void {
        const [x, y] = coords;
        this.map[y][x].drawPiece();
    }

    isFullCollapsed(): boolean {
        let isCollapsed = true;
        this.map.forEach((row) => {
            row.forEach((element) => {
                if(!element.isCollapsed()) {
                    isCollapsed = false;
                }
            })
        });
        return isCollapsed;
    }

    getElement(coords: [number, number]): MapElement {
        const [x, y] = coords;
        return this.map[y][x];
    }

    inBounds(coords: [number, number]): boolean {
        const [x, y] = coords;
        return x >= 0 && x < this.MAP_SIZE && y >= 0 && y < this.MAP_SIZE;
    }

    draw(): void {
        const mapElement = document.getElementById("map");
        if(mapElement) {
            mapElement.innerHTML = "";
        }

        this.map.forEach((row, y) => {
            row.forEach((element, x) => {

                // if(element.isCollapsed()) {
                //     const pieceElement = document.createElement("div");
                //     pieceElement.style.gridColumnStart = (y+1).toString();
                //     pieceElement.style.gridRowStart = (x+1).toString();
                //     pieceElement.classList.add("collapsed");
                //     pieceElement.innerHTML = element.collapsedPiece.toString();
                //     mapElement?.appendChild(pieceElement);
                // }
                // else {
                //     const pieceElement = document.createElement("div");
                //     pieceElement.style.gridColumnStart = (y+1).toString();
                //     pieceElement.style.gridRowStart = (x+1).toString();
                //     pieceElement.classList.add("unknown");
                //     pieceElement.innerHTML = element.getEntropy().toString();
                //     mapElement?.appendChild(pieceElement);
                // }

                if(element.isCollapsed()) {
                    const pieceElement = document.createElement("div");
                    pieceElement.style.gridColumnStart = (y+1).toString();
                    pieceElement.style.gridRowStart = (x+1).toString();
                    pieceElement.classList.add(this.MAP_PIECES[element.collapsedPiece]);
                    mapElement?.appendChild(pieceElement);
                } 
                else {
                    const pieceElement = document.createElement("div");
                    pieceElement.style.gridColumnStart = (y+1).toString();
                    pieceElement.style.gridRowStart = (x+1).toString();
                    pieceElement.classList.add("unknown");
                    pieceElement.innerHTML = element.getEntropy().toString();
                    mapElement?.appendChild(pieceElement);
                }

            });
        });
    }
}



class WaveFunction {
    map: GameMap;
    lastRenderTime;
    constructor() {
        this.map = new GameMap();
        this.lastRenderTime = 0;
    }
    
    run(): void {
        const elementCoords = this.map.getLowestEntropyElementCoords();
        const [x, y] = elementCoords;
        this.collapse(elementCoords);
        const element = this.map.getElement(elementCoords);

        for(const side in Direction) {
            if(!isNaN(Number(side))) {
                let remainingValues = element.getRemainingValues(Number(side));
                if(remainingValues.size == 1) {
                    let [newX, newY] = getNextCoords(x, y, Number(side));
                    if(this.map.inBounds([newX, newY])) {
                        this.propagate([newX, newY], Number(side), [...remainingValues][0]);
                    }
                }
            }
        }



        if(!this.map.isFullCollapsed()) {
            setTimeout(() => {
                    requestAnimationFrame(() => this.run());
                }, 1000);
            this.map.draw();
        }
    }

    collapse(coords: [number, number]): void {
        this.map.drawPieceOnCoords(coords);
    }

    propagate(coords: [number, number], side: Direction, value: number): void {
        // side - side of the element from which the propagation is happening
        const [x, y] = coords;

        const element = this.map.getElement(coords);
        if(element.isCollapsed()) {
            return;
        }

        const fromSide = getOppositeSide(side);
        const removed = element.removeValues(value, fromSide, COLLAPSE_RULES);

        if(removed) {
            for(const side in Direction) {
                if(!isNaN(Number(side))) {
                    let remainingValues = element.getRemainingValues(Number(side));
                    if(remainingValues.size == 1) {
                        let [newX, newY] = getNextCoords(x, y, Number(side));
                        if(this.map.inBounds([newX, newY])) {
                            this.propagate([newX, newY], Number(side), [...remainingValues][0]);
                        }
                    }
                }
            }
        }
    }
}



const waveFunction = new WaveFunction();
waveFunction.run();

