import { state } from '../core/state.js';
import { checkCollision } from '../systems/collision.js';

export function updateMovement(delta) {
    if (!state.controls.isLocked && state.cameraMode !== 'free') return;

    // Apply gravity
    state.velocity.y -= state.gravity;
    
    // Handle jumping
    if (state.keysPressed['Space'] && state.onGround) {
        state.velocity.y = state.jumpForce;
        state.onGround = false;
    }
    
    // Get direction from camera
    const direction = new THREE.Vector3();
    state.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    
    // Calculate movement vector
    const moveVector = new THREE.Vector3(0, 0, 0);
    
    if (state.keysPressed['KeyW']) moveVector.add(direction);
    if (state.keysPressed['KeyS']) moveVector.sub(direction);
    if (state.keysPressed['KeyA']) moveVector.add(direction.clone().cross(new THREE.Vector3(0, 1, 0)));
    if (state.keysPressed['KeyD']) moveVector.sub(direction.clone().cross(new THREE.Vector3(0, 1, 0)));
    
    // Normalize and apply movement
    if (moveVector.length() > 0) {
        moveVector.normalize();
        state.velocity.x = moveVector.x * state.movementSpeed;
        state.velocity.z = moveVector.z * state.movementSpeed;
    }

    // Apply movement
    const originalPosition = state.character.position.clone();
    state.character.position.x += state.velocity.x;
    state.character.position.z += state.velocity.z;
    state.character.position.y += state.velocity.y;

    // Collision check
    if (checkCollision(state.character)) {
        state.character.position.copy(originalPosition);
    }

    // Ground collision
    if (state.character.position.y < 1) {
        state.character.position.y = 1;
        state.velocity.y = 0;
        state.onGround = true;
    }
}
