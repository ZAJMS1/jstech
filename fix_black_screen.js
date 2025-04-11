// Create a script to fix black screen issues on all game HTML files
const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(file => 
  file.endsWith('.html') && 
  file !== 'index.html' && 
  fs.existsSync(file)
);

console.log('Found', htmlFiles.length, 'HTML files to process');

let filesFixed = 0;

htmlFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if file has animate function
    if (content.includes('function animate(time)')) {
      console.log('Processing', file);
      
      // Add try-catch inside animate function
      let updated = content.replace(
        /function animate\(time\) \{\s+requestAnimationFrame\(animate\);/g,
        'function animate(time) {\n    requestAnimationFrame(animate);\n    \n    try {'
      );
      
      // Add catch block before the end of animate function
      updated = updated.replace(
        /(\s+renderer\.render\(scene, camera\);\s+)\}/g,
        '$1    } catch (err) {\n        console.error("Animation error in ' + file + ':", err);\n        document.getElementById("debug").textContent = "Error: " + err.message;\n    }\n}'
      );
      
      // Ensure scene is rendered with proper lighting
      if (!updated.includes('scene.background = new THREE.Color')) {
        const sceneCreationIndex = updated.indexOf('const scene = new THREE.Scene()');
        if (sceneCreationIndex > 0) {
          const insertIndex = sceneCreationIndex + 'const scene = new THREE.Scene();'.length;
          const additionalCode = '\n    scene.background = new THREE.Color(0x121212); // Dark background\n    scene.fog = new THREE.FogExp2(0x121212, 0.015); // Subtle fog';
          updated = updated.slice(0, insertIndex) + additionalCode + updated.slice(insertIndex);
        }
      }
      
      // Force visibility of player
      if (updated.includes('const player = createLowPolyCharacter()')) {
        const playerCreationIndex = updated.indexOf('const player = createLowPolyCharacter()');
        if (playerCreationIndex > 0) {
          const insertIndex = playerCreationIndex + 'const player = createLowPolyCharacter();'.length;
          const additionalCode = '\n    player.position.set(0, 1, 50); // Reset position\n    scene.add(player); // Ensure player is added to scene';
          updated = updated.slice(0, insertIndex) + additionalCode + updated.slice(insertIndex);
        }
      }
      
      // Add a basic light if needed
      if (!updated.includes('AmbientLight')) {
        const sceneCreationIndex = updated.indexOf('const scene = new THREE.Scene()');
        if (sceneCreationIndex > 0) {
          const insertIndex = sceneCreationIndex + 'const scene = new THREE.Scene();'.length;
          const additionalCode = '\n    // Add basic lighting\n    const ambientLight = new THREE.AmbientLight(0x555566, 0.6);\n    scene.add(ambientLight);\n    \n    const dirLight = new THREE.DirectionalLight(0x556677, 0.8);\n    dirLight.position.set(30, 100, 30);\n    dirLight.castShadow = true;\n    scene.add(dirLight);';
          updated = updated.slice(0, insertIndex) + additionalCode + updated.slice(insertIndex);
        }
      }
      
      // Force camera initialization
      if (updated.includes('const camera = new THREE.PerspectiveCamera')) {
        const cameraInitIndex = updated.indexOf('const camera = new THREE.PerspectiveCamera');
        if (cameraInitIndex > 0) {
          // Find the end of the camera initialization statement
          const semicolonIndex = updated.indexOf(';', cameraInitIndex);
          if (semicolonIndex > 0) {
            const insertIndex = semicolonIndex + 1;
            const additionalCode = '\n    camera.position.set(0, 5, 60); // Position camera behind player\n    camera.lookAt(0, 2, 0); // Look at where the player would be';
            updated = updated.slice(0, insertIndex) + additionalCode + updated.slice(insertIndex);
          }
        }
      }
      
      // Check for changes
      if (content !== updated) {
        fs.writeFileSync(file, updated);
        console.log('Fixed', file);
        filesFixed++;
      } else {
        console.log('No changes needed for', file);
      }
    }
  } catch (err) {
    console.error('Error processing', file, err);
  }
});

console.log('Fixed', filesFixed, 'files'); 