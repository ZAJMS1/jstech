import { createTerrain } from './terrain.js';
import { createBuildings } from './buildings.js';
import { addDecorations } from './decorations.js';

export function createEnvironment() {
    createTerrain();
    createBuildings();
    addDecorations();
}
