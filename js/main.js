import { state } from './core/state.js';
import { initGame } from './core/initialization.js';
import { updateMovement } from './controls/movement.js';
import { updateCamera } from './controls/camera.js';
import { initAudioEffects } from './systems/audio.js';
import { animateCharacter } from './character/animations.js';

// Initialize the game
initGame();
initAudioEffects();

// Animation loop
function animate(time) {
    requestAnimationFrame(animate);
    
    const delta = state.clock.getDelta();
    
    updateMovement(delta);
    updateCamera();
    animateCharacter(delta);
    
    // Update lighting effects
    if (window.flickeringLights) {
        window.flickeringLights.forEach(light => {
            const { flickerSpeed, flickerIntensity, baseIntensity, timeOffset } = light.userData;
            
            const flicker = Math.sin(time * flickerSpeed + timeOffset) * 0.5 + 0.5;
            const noise = Math.random() * 0.2;
            
            light.intensity = baseIntensity * (1 - flickerIntensity * 0.8) + 
                              flickerIntensity * baseIntensity * (flicker + noise);
        });
    }
    
    state.renderer.render(state.scene, state.camera);
}

animate(0);