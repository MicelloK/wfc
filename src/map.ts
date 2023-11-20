import { drawElement } from "./drawElement";
import { MapElement } from "./mapElement";

export class GameMap {
    MAP_SIZE = Number(getComputedStyle(document.documentElement).getPropertyValue('--map-size'));
    map: MapElement[][];

    constructor(possibleMapPieces: number[]) {
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
                if(element.isCollapsed()) {
                    drawElement([x, y], element.collapsedPiece);
                } 
                else {
                    const entropy = element.getEntropy();
                    const color = 'rgb(' + (255 - entropy * 25) + ', ' + (entropy * 25) + ', 0, 0.35)';
                    const pieceElement = document.createElement("div");
                    pieceElement.style.gridColumnStart = (y+1).toString();
                    pieceElement.style.gridRowStart = (x+1).toString();
                    pieceElement.classList.add("unknown");
                    pieceElement.innerHTML = entropy.toString();
                    pieceElement.style.color = color;
                    mapElement?.appendChild(pieceElement);
                }
            });
        });
    }
}