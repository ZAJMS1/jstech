import { state } from '../core/state.js';

export function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        state.keysPressed[event.code] = true;
        
        // Handle inventory toggle
        if (event.code === 'KeyE') {
            toggleInventory();
        }
    });
    
    document.addEventListener('keyup', (event) => {
        state.keysPressed[event.code] = false;
    });
    
    // Handle pointer lock
    state.renderer.domElement.addEventListener('click', () => {
        state.controls.lock();
    });
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}
