import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Game state
const state = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    character: null,
    movementSpeed: 0.15,
    jumpForce: 0.35,
    gravity: 0.01,
    velocity: new THREE.Vector3(),
    onGround: false,
    keysPressed: {},
    clock: new THREE.Clock(),
    terrainSize: 100,
    buildingCount: 15,
    objects: [],
    colliders: []
};

// Loading manager
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);

manager.onLoad = function() {
    hideLoadingScreen();
};

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 500);
}

// Initialize the game
init();

function init() {
    // Create scene
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x050505);
    state.scene.fog = new THREE.FogExp2(0x050505, 0.035);
    
    // Create camera
    state.camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    state.camera.position.set(0, 2, 5);
    
    // Create renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(state.renderer.domElement);
    
    // Controls for first-person movement
    state.controls = new PointerLockControls(state.camera, document.body);
    
    // Event to lock pointer on canvas click
    state.renderer.domElement.addEventListener('click', () => {
        state.controls.lock();
    });
    
    // Add lights
    addLights();
    
    // Create environment
    createTerrain();
    createBuildings();
    addDecorations();
    
    // Set up event listeners
    setupEventListeners();
    
    // Force hide loading screen after initialization in case the manager doesn't trigger
    setTimeout(hideLoadingScreen, 2000);
    
    // Start animation
    animate();
}

function addLights() {
    // Ambient light (brighter for better visibility)
    const ambientLight = new THREE.AmbientLight(0x555555, 0.7);
    state.scene.add(ambientLight);
    
    // Directional light (brighter sun)
    const dirLight = new THREE.DirectionalLight(0x9999bb, 1.0);
    dirLight.position.set(5, 20, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    state.scene.add(dirLight);
    
    // Add some fog/haze glow lights for atmosphere
    const fogLight1 = new THREE.PointLight(0x557799, 2.5, 15);
    fogLight1.position.set(-10, 1, -10);
    state.scene.add(fogLight1);
    
    const fogLight2 = new THREE.PointLight(0x775555, 2.5, 20);
    fogLight2.position.set(15, 0.5, 15);
    state.scene.add(fogLight2);
}

function createTerrain() {
    // Ground plane
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Create a simple procedural texture for the ground
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Dark base
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add some noise/texture
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 2 + 1;
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.5})`;
        ctx.fillRect(x, y, size, size);
    }
    
    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);
    
    groundMaterial.map = groundTexture;
    
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(state.terrainSize, state.terrainSize, 32, 32),
        groundMaterial
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    state.scene.add(ground);
    state.colliders.push(ground);
    
    // Add some terrain variation
    for (let i = 0; i < 40; i++) {
        const size = Math.random() * 3 + 1;
        const height = Math.random() * 0.5 + 0.2;
        
        const rockGeom = new THREE.BoxGeometry(size, height, size);
        const rockMat = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const rock = new THREE.Mesh(rockGeom, rockMat);
        rock.position.x = (Math.random() - 0.5) * (state.terrainSize - 10);
        rock.position.y = height / 2;
        rock.position.z = (Math.random() - 0.5) * (state.terrainSize - 10);
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        state.scene.add(rock);
        state.colliders.push(rock);
    }
}

function createBuildings() {
    // Create dystopian low-poly buildings
    for (let i = 0; i < state.buildingCount; i++) {
        const width = Math.random() * 5 + 3;
        const height = Math.random() * 15 + 5;
        const depth = Math.random() * 5 + 3;
        
        const buildingGeom = new THREE.BoxGeometry(width, height, depth);
        
        // Create window pattern
        const windowTexture = createWindowTexture();
        
        // Building material
        const buildingMat = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0x333333 : 0x222222,
            roughness: 0.9,
            metalness: 0.2,
            map: windowTexture
        });
        
        const building = new THREE.Mesh(buildingGeom, buildingMat);
        
        // Position buildings around the terrain
        const angle = i * (2 * Math.PI / state.buildingCount);
        const radius = Math.random() * 20 + 15;
        
        building.position.x = Math.cos(angle) * radius;
        building.position.y = height / 2;
        building.position.z = Math.sin(angle) * radius;
        
        // Rotate buildings randomly
        building.rotation.y = Math.random() * Math.PI;
        
        building.castShadow = true;
        building.receiveShadow = true;
        
        state.scene.add(building);
        state.colliders.push(building);
    }
}

function createWindowTexture() {
    // Create a procedural window texture for buildings
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Dark background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 512, 512);
    
    // Create window pattern
    ctx.fillStyle = '#222';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            // Some windows are lit (yellowish)
            if (Math.random() > 0.8) {
                ctx.fillStyle = `rgba(${50 + Math.random() * 30}, ${50 + Math.random() * 20}, 0, 0.8)`;
            } else {
                ctx.fillStyle = '#222';
            }
            
            ctx.fillRect(
                x * 64 + 5, 
                y * 64 + 5, 
                54, 
                54
            );
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function addDecorations() {
    // Add dystopian decorations (broken street lamps, trash cans, etc.)
    for (let i = 0; i < 10; i++) {
        // Create a simple street lamp
        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 0.4, 6),
            new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
        );
        
        const lampPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 3, 6),
            new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.6 })
        );
        lampPole.position.y = 1.5;
        
        const lampHead = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.2, 0.4),
            new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 })
        );
        lampHead.position.y = 3;
        
        // Create a dim light for some lamps (some are broken)
        if (Math.random() > 0.5) {
            const lampLight = new THREE.PointLight(0xffffaa, 0.8, 7);
            lampLight.position.y = 3;
            lampHead.add(lampLight);
        }
        
        const lamp = new THREE.Group();
        lamp.add(lampBase);
        lamp.add(lampPole);
        lamp.add(lampHead);
        
        // Position lamps around
        const angle = i * (2 * Math.PI / 10);
        const radius = 25;
        
        lamp.position.x = Math.cos(angle) * radius;
        lamp.position.z = Math.sin(angle) * radius;
        
        // Add some random rotation for broken appearance
        if (Math.random() > 0.7) {
            lamp.rotation.z = (Math.random() - 0.5) * 0.2;
        }
        
        lamp.castShadow = true;
        lamp.receiveShadow = true;
        
        state.scene.add(lamp);
    }
}

function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        state.keysPressed[event.code] = true;
    });
    
    document.addEventListener('keyup', (event) => {
        state.keysPressed[event.code] = false;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        state.camera.aspect = window.innerWidth / window.innerHeight;
        state.camera.updateProjectionMatrix();
        state.renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function update() {
    const delta = state.clock.getDelta();
    
    // Only allow movement when controls are locked
    if (state.controls.isLocked) {
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
        
        // Calculate movement vector based on keys pressed
        const moveVector = new THREE.Vector3(0, 0, 0);
        
        if (state.keysPressed['KeyW']) {
            moveVector.add(direction);
        }
        
        if (state.keysPressed['KeyS']) {
            moveVector.sub(direction);
        }
        
        if (state.keysPressed['KeyA']) {
            moveVector.add(direction.clone().cross(new THREE.Vector3(0, 1, 0)));
        }
        
        if (state.keysPressed['KeyD']) {
            moveVector.sub(direction.clone().cross(new THREE.Vector3(0, 1, 0)));
        }
        
        // Normalize movement vector if not zero
        if (moveVector.length() > 0) {
            moveVector.normalize();
        }
        
        // Set horizontal velocity based on movement direction
        state.velocity.x = moveVector.x * state.movementSpeed;
        state.velocity.z = moveVector.z * state.movementSpeed;
        
        // Move character
        state.controls.moveRight(state.velocity.x);
        state.controls.moveForward(state.velocity.z);
        
        // Apply vertical velocity (gravity/jumping)
        state.camera.position.y += state.velocity.y;
        
        // Simple collision detection with ground
        if (state.camera.position.y < 2) {
            state.camera.position.y = 2;
            state.velocity.y = 0;
            state.onGround = true;
        }
        
        // Keep player within bounds
        const boundary = state.terrainSize / 2 - 5;
        if (state.camera.position.x > boundary) state.camera.position.x = boundary;
        if (state.camera.position.x < -boundary) state.camera.position.x = -boundary;
        if (state.camera.position.z > boundary) state.camera.position.z = boundary;
        if (state.camera.position.z < -boundary) state.camera.position.z = -boundary;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    update();
    
    state.renderer.render(state.scene, state.camera);
} 