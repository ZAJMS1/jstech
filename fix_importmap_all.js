const fs = require('fs');

// Files to fix
const filesToFix = ['game.html', 'sneak.html', 'alternative.html', 'disguise.html'];

// Correct importmap and event listener script
const correctImportmap = `<script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.158.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.158.0/examples/jsm/"
            }
        }
    </script>
<script>
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

// Regular expression pattern to match the broken importmap and event listener
const brokenPattern = /<script type="importmap">[\s\S]*?<\/script>\s*to restart buttons to clear inventory[\s\S]*?<\/script>/m;

// Function to fix a single file
function fixFile(filename) {
    try {
        // Check if file exists
        if (!fs.existsSync(filename)) {
            console.log(`File ${filename} does not exist. Skipping.`);
            return false;
        }

        console.log(`Fixing importmap and event listener script in ${filename}...`);
        
        // Read file content
        let content = fs.readFileSync(filename, 'utf8');
        
        // Check if the file already has the correct importmap
        if (content.includes(correctImportmap)) {
            console.log(`${filename} already has the correct importmap. Skipping.`);
            return false;
        }
        
        // Try to match and replace the broken pattern
        if (content.match(brokenPattern)) {
            content = content.replace(brokenPattern, correctImportmap);
            fs.writeFileSync(filename, content, 'utf8');
            console.log(`Successfully fixed importmap and event listener script in ${filename}`);
            return true;
        } 
        
        // If we can't find the exact pattern, try to find and replace just the importmap section
        const importmapPattern = /<script type="importmap">[\s\S]*?<\/script>/;
        if (content.match(importmapPattern)) {
            content = content.replace(importmapPattern, correctImportmap);
            fs.writeFileSync(filename, content, 'utf8');
            console.log(`Successfully replaced importmap section in ${filename}`);
            return true;
        }
        
        console.log(`Could not find importmap section in ${filename}. No changes made.`);
        return false;
    } catch (error) {
        console.error(`Error fixing ${filename}:`, error.message);
        return false;
    }
}

// Fix all files
let fixedCount = 0;
for (const file of filesToFix) {
    if (fixFile(file)) {
        fixedCount++;
    }
}

console.log(`Completed fixing importmap in ${fixedCount} out of ${filesToFix.length} files.`); 