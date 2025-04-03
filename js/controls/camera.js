import { state } from '../core/state.js';

export function updateCamera() {
    if (state.cameraMode === 'free') {
        // Handle free camera movement
        if (state.rightMouseDown) {
            // ...orbital camera movement logic...
        }
    } else {
        // First person camera updates
        state.camera.position.y = Math.max(2, state.camera.position.y);
    }
}
