// Script to remove the house from sneak.html, alternative.html, and disguise.html
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(file, 'utf8');
    
    // Find and remove house creation code
    let modifiedContent = content;
    
    // 1. Remove the houseGroup creation and scene.add
    modifiedContent = modifiedContent.replace(
      /\/\/ Create a house the player can walk around in\s+const houseGroup = new THREE\.Group\(\);\s+scene\.add\(houseGroup\);/g,
      '// House removed'
    );
    
    // 2. Remove all materials specific to the house
    // The materials library is used by other parts of the code, so we'll keep it
    // but remove house-specific materials like roofTiles, wallExterior, wallInterior
    
    // 3. Remove all house dimensions and related variables
    modifiedContent = modifiedContent.replace(
      /\/\/ House dimensions[\s\S]*?wallThickness: 1\s+\};/g,
      '// House dimensions removed'
    );
    
    // 4. Remove door and window dimensions
    modifiedContent = modifiedContent.replace(
      /\/\/ Door and window dimensions[\s\S]*?var windowHeight = 5;/g,
      '// Door and window dimensions removed'
    );
    
    // 5. Remove all functions and code that add elements to houseGroup
    // This includes createWallSection, mainFloor, ceiling, walls, windows, furniture
    
    // Remove all instances of houseGroup.add
    modifiedContent = modifiedContent.replace(/houseGroup\.add\([^)]+\);/g, '// House element removed');
    
    // Remove wall section creation function
    modifiedContent = modifiedContent.replace(
      /\/\/ Function to create wall sections[\s\S]*?function createWallSection[\s\S]*?return wall;\s+\}/g,
      '// Wall section creation function removed'
    );
    
    // Remove window creation function and all window additions
    modifiedContent = modifiedContent.replace(
      /\/\/ Function to create windows[\s\S]*?function createWindow[\s\S]*?return windowGroup;\s+\}/g,
      '// Window creation function removed'
    );
    
    // 6. Update player starting position since it was inside the house
    // Change player.position.set(0, 1, 25) to a position outside
    modifiedContent = modifiedContent.replace(
      /player\.position\.set\(0, 1, 25\); \/\/ Near the front door, inside the house/g,
      'player.position.set(0, 1, 50); // Starting position adjusted (outside)'
    );
    
    // Also fix any other player positions that might be house-dependent in disguise.html
    if (file === 'disguise.html') {
      modifiedContent = modifiedContent.replace(
        /player\.position\.set\(0, 1, 200\); \/\/ Position near the border/g,
        'player.position.set(0, 1, 200); // Position near the border'
      );
    }
    
    // Write the modified content back to the file
    fs.writeFileSync(file, modifiedContent, 'utf8');
    console.log(`Successfully removed house from ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('House removal completed for all files!'); 