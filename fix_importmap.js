// Script to fix the broken importmap in game.html
const fs = require('fs');

try {
  console.log("Fixing importmap in game.html...");
  const gameFile = 'game.html';
  let content = fs.readFileSync(gameFile, 'utf8');
  
  // Find the broken importmap script tag
  const brokenImportMap = /<script type="importmap">\s*\{\s*"imports": \{\s*"three": "[^"]+",\s*"three\/addons\/": "[^"]+"\s*\}\s*\}\s*\/\/ Add event listeners/;
  
  // The correct importmap
  const correctImportMap = `<script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.158.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.158.0/examples/jsm/"
            }
        }
    </script>`;
  
  if (content.match(brokenImportMap)) {
    // Replace the broken importmap with the correct one
    content = content.replace(brokenImportMap, correctImportMap);
    
    // Now add the clearInventoryOnRestartCode as a separate script tag
    const clearInventoryScript = `<script>
    // Add event listeners to restart buttons to clear inventory
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.restart-game, #restart-game').forEach(button => {
            button.addEventListener('click', function() {
                // Clear localStorage before restarting
                localStorage.removeItem('gameInventory');
                localStorage.removeItem('hasBackpack');
                console.log('Game restarting, inventory cleared');
            });
        });
    });
    </script>`;
    
    // Find the head tag closing to insert our script
    const headClose = /<\/head>/;
    content = content.replace(headClose, clearInventoryScript + '\n</head>');
    
    // Write the fixed content back to the file
    fs.writeFileSync(gameFile, content, 'utf8');
    console.log("Successfully fixed importmap in game.html");
  } else {
    console.log("Could not find broken importmap in game.html");
  }
} catch (error) {
  console.error("Error fixing importmap:", error);
} 