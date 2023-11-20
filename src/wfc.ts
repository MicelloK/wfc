import { GameMap } from "./map";
import { DIRECTIONS, Direction, getOppositeSide, getNextCoords } from "./directions";

export class WaveFunctionCollapse {
    map: GameMap;
    lastRenderTime;
    collapseRules;
    constructor(map: GameMap, collapseRules: { [key: number]: number[] }) {
        this.map = map;
        this.lastRenderTime = 0;
        this.collapseRules = collapseRules;
    }
    
    run(delay: number): void {
        const elementCoords = this.map.getLowestEntropyElementCoords();
        const [x, y] = elementCoords;
        this.collapse(elementCoords);
        const element = this.map.getElement(elementCoords);

        for(const direction of DIRECTIONS) {
            let [newX, newY] = getNextCoords(x, y, direction);
            if(this.map.inBounds([newX, newY])) {
                let remainingValues = element.getRemainingValues(direction, this.collapseRules);
                this.propagate([newX, newY], direction, [...remainingValues][0]);
            }
        }

        for(const direction of DIRECTIONS) {
            let [newX, newY] = getNextCoords(x, y, direction);
                if(this.map.inBounds([newX, newY])) {
                    let remainingValues = element.getRemainingValues(direction, this.collapseRules);
                    this.propagate([newX, newY], direction, [...remainingValues][0]);
                }
        }

        if(!this.map.isFullCollapsed()) {
            setTimeout(() => {
                    requestAnimationFrame(() => this.run(delay));
                }, delay);
            this.map.draw();
        }
        else {
            this.map.draw();
        }
    }

    collapse(coords: [number, number]): void {
        this.map.drawPieceOnCoords(coords);
    }

    propagate(coords: [number, number], side: Direction, value: number): void {
        const [x, y] = coords;

        const element = this.map.getElement(coords);
        if(element.isCollapsed()) {
            return;
        }

        const fromSide = getOppositeSide(side);
        const removed = element.removeValues(value, fromSide, this.collapseRules);

        if(removed) {
            for(const direction of DIRECTIONS) {
                let remainingValues = element.getRemainingValues(direction, this.collapseRules);
                    if(remainingValues.size == 1) {
                        let [newX, newY] = getNextCoords(x, y, direction);
                        if(this.map.inBounds([newX, newY])) {
                            this.propagate([newX, newY], direction, [...remainingValues][0]);
                        }
                    }
            }
        }
    }
}