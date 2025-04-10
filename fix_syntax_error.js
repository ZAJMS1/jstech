// Script to fix syntax errors in the HTML files
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Fixing syntax error in ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix the issue where we have "// House removed - this is just a placeholder to prevent reference errors// Roof"
    // followed by materials definition and then an extra closing brace
    content = content.replace(
      /\/\/ House removed - this is just a placeholder to prevent reference errors\/\/ Roof[\s\S]*?}\s*;/,
      '// House removed - this is just a placeholder to prevent reference errors'
    );
    
    // Add the houseGroup if needed and missing
    if (content.includes('houseGroup') && !content.includes('const houseGroup = new THREE.Group()')) {
      content = content.replace(
        /\/\/ House removed/,
        '// House removed\n                const houseGroup = new THREE.Group(); // Empty group as placeholder\n                scene.add(houseGroup);'
      );
    }
    
    // Write the fixed content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully fixed syntax error in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Finished fixing syntax errors in all files.'); 