import * as THREE from 'three';
import { state } from '../core/state.js';

export function checkCollision(object) {
    // Create raycasters for collision detection
    const directions = [
        new THREE.Vector3(1, 0, 0),   // Right
        new THREE.Vector3(-1, 0, 0),  // Left
        new THREE.Vector3(0, 0, 1),   // Forward
        new THREE.Vector3(0, 0, -1),  // Backward
    ];
    
    const playerRadius = 0.5;
    
    // Check collisions in each direction
    for (const direction of directions) {
        const raycaster = new THREE.Raycaster(
            object.position,
            direction,
            0,
            playerRadius
        );
        
        const intersects = raycaster.intersectObjects(state.colliders, true);
        
        if (intersects.length > 0) {
            return true;
        }
    }
    
    return false;
}
