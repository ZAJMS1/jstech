// Script to fix missing function references in the HTML files
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Adding placeholder functions to ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Find a good insertion point - after materials and houseDimensions definitions
    // but before the first use of createWallSection or other functions
    const insertPoint = content.indexOf('// House removed - this is just a placeholder to prevent reference errors');
    
    if (insertPoint !== -1) {
      const placeholderFunctions = `
                // Placeholder functions to prevent reference errors
                
                // Wall section creation function placeholder
                function createWallSection(width, height, depth, x, y, z, material) {
                    // Return empty mesh that doesn't render
                    const wall = new THREE.Mesh(
                        new THREE.BoxGeometry(0, 0, 0),
                        material
                    );
                    wall.position.set(x, y, z);
                    wall.visible = false; // Make invisible
                    return wall;
                }
                
                // Window creation function placeholder
                function createWindow(width, height, x, y, z, rotationY) {
                    // Return empty group that doesn't render
                    const windowGroup = new THREE.Group();
                    windowGroup.position.set(x, y, z);
                    windowGroup.rotation.y = rotationY || 0;
                    windowGroup.visible = false; // Make invisible
                    return windowGroup;
                }
                `;
      
      // Insert the placeholder functions
      content = content.substring(0, insertPoint + '// House removed - this is just a placeholder to prevent reference errors'.length) + 
                placeholderFunctions + 
                content.substring(insertPoint + '// House removed - this is just a placeholder to prevent reference errors'.length);
      
      // Write the fixed content back to the file
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Successfully added placeholder functions to ${file}`);
    } else {
      console.log(`Could not find appropriate insertion point in ${file}`);
    }
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Finished adding placeholder functions to all files.'); 