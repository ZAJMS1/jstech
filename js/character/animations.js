import { state } from '../core/state.js';

export function animateCharacter(delta) {
    if (!state.character) return;
    
    // Determine animation state
    const animationState = getAnimationState();
    
    // Reset all animations first
    resetCharacterPose();
    
    // Apply animation based on state
    switch (animationState) {
        case 'idle':
            idleAnimation(delta);
            break;
        case 'walking':
            walkingAnimation(delta);
            break;
        case 'jumping':
            jumpingAnimation(delta);
            break;
    }
}

function getAnimationState() {
    if (!state.onGround) {
        return 'jumping';
    }
    if (isMoving()) {
        return 'walking';
    }
    return 'idle';
}

function isMoving() {
    return state.keysPressed['KeyW'] || 
           state.keysPressed['KeyS'] || 
           state.keysPressed['KeyA'] || 
           state.keysPressed['KeyD'];
}

function resetCharacterPose() {
    // ...existing reset animation code...
}

function idleAnimation(delta) {
    // ...existing idle animation code...
}

function walkingAnimation(delta) {
    // ...existing walking animation code...
}

function jumpingAnimation(delta) {
    // ...existing jumping animation code...
}
