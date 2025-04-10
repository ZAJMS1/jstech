// Script to fix duplicate function declarations in the HTML files
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Fixing duplicate function definitions in ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Find original createWindow function definition
    const originalFunctionRegex = /\/\/ Function to create windows[\s\S]*?function createWindow[\s\S]*?return windowGroup;\s+\}/;
    const match = content.match(originalFunctionRegex);
    
    if (match) {
      // Remove the original function definition
      content = content.replace(originalFunctionRegex, '// Original window creation function removed');
      console.log(`Found and removed the original createWindow function in ${file}`);
    } else {
      console.log(`Original createWindow function not found in ${file}`);
    }
    
    // Write the fixed content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully fixed ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Finished fixing duplicate function declarations in all files.'); 