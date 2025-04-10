// Script to fix both the importmap and event listener script in game.html
const fs = require('fs');

try {
  console.log("Fixing importmap and event listener script in game.html...");
  const gameFile = 'game.html';
  let content = fs.readFileSync(gameFile, 'utf8');
  
  // Find the current importmap and event listener text
  const brokenImportMapAndListener = /<script type="importmap">[\s\S]*?<\/script>\s*to restart buttons to clear inventory[\s\S]*?<\/script>/m;
  
  // The correct importmap
  const correctImportMap = `<script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.158.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.158.0/examples/jsm/"
            }
        }
    </script>`;
    
  // The correct event listener script
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
  
  if (content.match(brokenImportMapAndListener)) {
    // Replace the broken importmap with the correct one and add the event listener script
    content = content.replace(brokenImportMapAndListener, correctImportMap + '\n' + clearInventoryScript);
    
    // Write the fixed content back to the file
    fs.writeFileSync(gameFile, content, 'utf8');
    console.log("Successfully fixed importmap and event listener script in game.html");
  } else {
    console.log("Could not find broken sections in game.html");
  }
} catch (error) {
  console.error("Error fixing importmap and event listener script:", error);
} 