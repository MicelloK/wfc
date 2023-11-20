import { WaveFunctionCollapse } from './wfc';
import { GameMap } from './map';
import { COLLAPSE_RULES, MAP_PIECES, ANIMATION_DELAY } from './settings';

const map = new GameMap(MAP_PIECES);
const wfc = new WaveFunctionCollapse(map, COLLAPSE_RULES);
wfc.run(ANIMATION_DELAY);
