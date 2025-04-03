import * as THREE from 'three';
import { state } from '../core/state.js';

export function createTerrain() {
    // Ground plane
    const groundMaterial = createGroundMaterial();
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(state.terrainSize, state.terrainSize, 32, 32),
        groundMaterial
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    state.scene.add(ground);
    state.colliders.push(ground);
    
    addTerrainDetails();
}

function createGroundMaterial() {
    // ...existing ground material creation code from main.js...
}

function addTerrainDetails() {
    // ...existing terrain variation code from main.js...
}
