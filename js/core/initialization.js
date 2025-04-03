import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { state } from './state.js';
import { setupEventListeners } from '../controls/input.js';
import { createEnvironment } from '../environment/environment.js';
import { addLights } from '../environment/lighting.js';
import { createCharacterModel } from '../character/model.js';

export function initGame() {
    // Create scene
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x0a0a0a); // Slightly lighter background
    state.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);
    
    // Create camera
    state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    state.camera.position.set(0, 2, 5);
    
    // Create renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(state.renderer.domElement);
    
    // Initialize controls
    state.controls = new PointerLockControls(state.camera, document.body);
    
    // Create and add character
    state.character = createCharacterModel();
    state.scene.add(state.character);
    
    // Setup game components
    addLights();
    createEnvironment();
    setupEventListeners();
}
