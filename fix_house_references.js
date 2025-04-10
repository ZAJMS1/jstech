// Script to fix houseDimensions references in the HTML files
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Fixing houseDimensions references in ${file}...`);
    const content = fs.readFileSync(file, 'utf8');
    
    // Find where the materials section ends, which is where we'll add our placeholder
    const materialEndIndex = content.indexOf('// Roof');
    
    if (materialEndIndex !== -1) {
      // Split the content at the materials section
      const beforeMaterials = content.substring(0, materialEndIndex);
      const afterMaterials = content.substring(materialEndIndex);
      
      // Define the replacement content that includes placeholder houseDimensions
      const replacementContent = `// Roof
                    roofTiles: new THREE.MeshStandardMaterial({ 
                        color: 0x5d4037, 
                        roughness: 0.9,
                        metalness: 0.1
                    })
                };
                
                // Placeholder for houseDimensions to prevent reference errors
                const houseDimensions = {
                    width: 50,
                    length: 50,
                    height: 15,
                    wallThickness: 1
                };
                
                // Door and window dimensions - placeholder to prevent reference errors
                var frontDoorWidth = 6;
                var frontDoorHeight = 10;
                var frontWallHeight = houseDimensions.height * 0.9;
                var windowWidth = 5;
                var windowHeight = 5;
                
                // House removed - this is just a placeholder to prevent reference errors`;
      
      // Replace the old sections with the new content
      let modifiedContent = beforeMaterials + replacementContent;
      
      // Remove any "House dimensions removed" or "Door and window dimensions removed" comments 
      // that our previous script might have added
      modifiedContent = modifiedContent.replace(/\/\/ House dimensions removed/g, '');
      modifiedContent = modifiedContent.replace(/\/\/ Door and window dimensions removed/g, '');
      
      // Ensure we preserve content after the materials section, but skip any existing houseDimensions definition
      // Find if there's already a placeholder or houseDimensions definition
      const existingHouseDimensions = afterMaterials.match(/const houseDimensions = \{[\s\S]*?\};/);
      const existingDoorWindowDimensions = afterMaterials.match(/var frontDoorWidth = [\s\S]*?var windowHeight = \d+;/);
      
      let remainingContent = afterMaterials;
      
      // Skip the materials closing brace and existing dimensions if found
      if (existingHouseDimensions) {
        const afterHouseDimensions = afterMaterials.indexOf(existingHouseDimensions[0]) + existingHouseDimensions[0].length;
        remainingContent = afterMaterials.substring(afterHouseDimensions);
      }
      
      if (existingDoorWindowDimensions) {
        const afterDoorWindowDimensions = afterMaterials.indexOf(existingDoorWindowDimensions[0]) + existingDoorWindowDimensions[0].length;
        remainingContent = afterMaterials.substring(afterDoorWindowDimensions);
      }
      
      // Skip the materials definition ending if we've already included it in our replacement
      if (remainingContent.trim().startsWith('};')) {
        remainingContent = remainingContent.substring(remainingContent.indexOf('};') + 2);
      }
      
      // Add the remaining content
      modifiedContent += remainingContent;
      
      // If there's any remaining houseGroup reference, define a dummy houseGroup
      if (modifiedContent.includes('houseGroup') && !modifiedContent.includes('const houseGroup = new THREE.Group()')) {
        // Find where we can insert the houseGroup definition
        const insertPoint = modifiedContent.indexOf('// House removed');
        if (insertPoint !== -1) {
          modifiedContent = modifiedContent.substring(0, insertPoint) + 
                            '// House removed\n                const houseGroup = new THREE.Group(); // Empty group as placeholder\n                ' + 
                            modifiedContent.substring(insertPoint);
        }
      }
      
      // Write the fixed content back to the file
      fs.writeFileSync(file, modifiedContent, 'utf8');
      console.log(`Successfully fixed houseDimensions references in ${file}`);
    } else {
      console.log(`Could not find materials section in ${file}`);
    }
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Finished fixing houseDimensions references in all files.'); 