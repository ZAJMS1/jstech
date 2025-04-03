import { config } from '../config/gameConfig.js';

// Game state management
export const state = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    character: null,
    movementSpeed: config.physics.movementSpeed,
    jumpForce: config.physics.jumpForce,
    gravity: config.physics.gravity,
    velocity: new THREE.Vector3(),
    onGround: false,
    keysPressed: {},
    clock: new THREE.Clock(),
    terrainSize: config.environment.terrainSize,
    buildingCount: config.environment.buildingCount,
    objects: [],
    colliders: [],
    cameraMode: 'free',
    mousePosition: { x: 0, y: 0 },
    rightMouseDown: false,
    inventory: {
        isOpen: false,
        items: [],
        slots: 15,
        slotElements: [],
        initialized: false
    },
    animation: {
        timeSinceLastStep: 0,
        jumpPhase: null,
        jumpTime: 0,
        landingComplete: true,
        idleTime: 0,
        lastHeadMove: 0,
        headTargetRotation: null
    }
};
