// Script to fix the specific duplicate createWindow function error
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Fixing duplicate createWindow function in ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Look for the specific duplicate createWindow function after the createWallSection function
    const duplicateFunctionRegex = /\/\/ Add windows\s+function createWindow[\s\S]*?return windowGroup;\s+}/;
    const match = content.match(duplicateFunctionRegex);
    
    if (match) {
      // Replace with a comment
      content = content.replace(duplicateFunctionRegex, '// Original window creation function removed');
      console.log(`Found and removed duplicate createWindow function in ${file}`);
    } else {
      console.log(`Duplicate createWindow function not found in ${file}`);
    }
    
    // Write the fixed content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Finished fixing duplicate function declarations.'); 