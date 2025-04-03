export const config = {
    physics: {
        gravity: 0.01,
        jumpForce: 0.35,
        movementSpeed: 0.15,
        maxVelocity: 2.0
    },
    
    environment: {
        terrainSize: 100,
        buildingCount: 15,
        fogDensity: 0.025, // Reduced fog density
        ambientLightIntensity: 0.7 // Increased ambient light
    },
    
    audio: {
        ambientVolume: 0.3,
        thunderVolume: 0.2,
        eerieVolume: 0.15,
        thunderMinDelay: 30000,
        thunderMaxDelay: 120000
    },
    
    character: {
        height: 2,
        radius: 0.5,
        eyeLevel: 1.8,
        boundaryOffset: 5
    }
};
