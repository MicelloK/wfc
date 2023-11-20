import { Direction } from "./directions.js";


export class MapElement {
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
    }

    deletePiece(piece: number): void {
        this.possiblePieces.delete(piece);
    }

    getRemainingValues(side: Direction, collapseRules: { [key: number]: number[] }): Set<number> {
        const remainingValues = new Set<number>();

        if(this.isCollapsed()) {
            remainingValues.add(collapseRules[this.collapsedPiece][side])
        }
        else {
            [...this.possiblePieces].forEach((piece) => {
                remainingValues.add(collapseRules[piece][side]);
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