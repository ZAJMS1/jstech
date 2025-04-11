// Script to fix undefined savedPosition errors in HTML files
const fs = require('fs');

// Get all HTML files
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
    let updated = false;
    
    // Check if file uses savedPosition variable but doesn't declare it
    if (content.includes('savedPosition') && !content.includes('let savedPosition')) {
      console.log(`Processing ${file} - needs savedPosition declaration`);
      
      // Find an appropriate place to add the variable declaration
      // Look for the window.onload function or similar initialization
      let insertionIndex = content.indexOf('window.onload = function() {');
      if (insertionIndex > 0) {
        // Find position after the opening brace and any initial content
        let braceIndex = content.indexOf('{', insertionIndex);
        if (braceIndex > 0) {
          let insertPosition = braceIndex + 1;
          // Add the declaration and initialization right after the opening brace
          let declaration = '\n                // Initialize saved position\n                let savedPosition = null;\n                \n                // Load saved position if available\n                try {\n                    const savedData = localStorage.getItem(\'gameData\');\n                    if (savedData) {\n                        const parsedData = JSON.parse(savedData);\n                        if (parsedData && parsedData.position) {\n                            savedPosition = parsedData.position;\n                            console.log("Loaded saved position:", savedPosition);\n                        }\n                    }\n                } catch (err) {\n                    console.error("Error loading saved position:", err);\n                }';
          
          content = content.slice(0, insertPosition) + declaration + content.slice(insertPosition);
          updated = true;
        }
      }
      
      // Also update references to check for undefined
      // Fix checkStoryProgress and other functions that use savedPosition
      content = content.replace(/if\s*\(\s*savedPosition\s*&&/g, 'if (typeof savedPosition !== "undefined" && savedPosition &&');
      
      // Save the updated file
      if (updated) {
        fs.writeFileSync(file, content);
        console.log(`Fixed savedPosition in ${file}`);
        filesFixed++;
      } else {
        console.log(`Could not find insertion point in ${file}`);
      }
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});

console.log(`Fixed ${filesFixed} files`); 