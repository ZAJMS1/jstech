import * as THREE from 'three';
import { state } from '../core/state.js';
import { config } from '../config/gameConfig.js';

export function addLights() {
    // Ambient light (slightly brighter)
    const ambientLight = new THREE.AmbientLight(0x444444, config.environment.ambientLightIntensity);
    state.scene.add(ambientLight);
    
    // Directional light (brighter)
    const dirLight = new THREE.DirectionalLight(0x8888aa, 1.0); // Increased intensity
    dirLight.position.set(5, 20, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    // ...existing code...

    // Brighter atmospheric lights
    const fogLight1 = new THREE.PointLight(0x446688, 2.5, 20); // Increased intensity and range
    fogLight1.position.set(-10, 1, -10);
    state.scene.add(fogLight1);
    
    const fogLight2 = new THREE.PointLight(0x664444, 2.5, 25); // Increased intensity and range
    fogLight2.position.set(15, 0.5, 15);
    state.scene.add(fogLight2);
}

export function updateLights(time) {
    if (window.flickeringLights) {
        // ...existing flickering lights code from main.js...
    }
}
