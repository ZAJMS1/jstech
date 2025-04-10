const fs = require('fs');

// Files to fix
const filesToFix = ['game.html', 'sneak.html', 'alternative.html', 'disguise.html'];

// Function to fix inventory display in a file
function fixFile(filePath) {
    try {
        // Read file content
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file contains playerInventory code
        if (!content.includes('window.playerInventory')) {
            console.log(`${filePath} doesn't contain inventory system. Skipping.`);
            return false;
        }
        
        console.log(`Fixing inventory display in ${filePath}...`);
        
        // 1. Fix inventory initialization to show by default when hasBackpack is true
        // Find the line that sets showUI(false) at initialization
        const hideInitPattern = /window\.playerInventory\.showUI\(false\); \/\/ Hide initially/g;
        
        if (content.match(hideInitPattern)) {
            content = content.replace(
                hideInitPattern, 
                'window.playerInventory.showUI(gameProgress.hasBackpack); // Show immediately if player has backpack'
            );
        }
        
        // 2. Make sure the inventory is displayed after DOM loaded
        const domLoadedPattern = /(document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?)(?=\/\/ Position player)/;
        
        if (domLoadedPattern.test(content)) {
            content = content.replace(
                domLoadedPattern,
                '$1\n    // Ensure inventory is displayed when hasBackpack is true\n    if (window.playerInventory && gameProgress.hasBackpack) {\n        window.playerInventory.showUI(true);\n    }\n    \n    '
            );
        }
        
        // 3. Ensure inventory is properly initialized in loadSavedInventory
        const loadSavedInventoryPattern = /(function loadSavedInventory\(\) \{[\s\S]*?gameProgress\.hasBackpack = savedBackpack === 'true';[\s\S]*?)(?=\}(\s*\/\/|\s*$))/;
        
        if (loadSavedInventoryPattern.test(content)) {
            content = content.replace(
                loadSavedInventoryPattern,
                '$1\n        // Make sure inventory is visible if player has backpack\n        if (window.playerInventory && gameProgress.hasBackpack) {\n            window.playerInventory.showUI(true);\n        }\n    '
            );
        }
        
        // 4. Add functionality to toggle inventory with the E key
        const keyHandlerPattern = /(case 'KeyE':[\s\S]*?toggleInventory\(\);)/;
        
        if (!keyHandlerPattern.test(content)) {
            // If the key handler doesn't exist or is missing, let's find where to add it
            const keyHandlersPattern = /(document\.addEventListener\('keydown', function\(event\) \{[\s\S]*?switch\s*\(event\.code\)\s*\{[\s\S]*?)(?=\}\);)/;
            
            if (keyHandlersPattern.test(content)) {
                content = content.replace(
                    keyHandlersPattern,
                    '$1\n                case \'KeyE\':\n                    // Toggle inventory when E is pressed\n                    console.log("E key pressed - toggling inventory");\n                    toggleInventory();\n                    break;\n            '
                );
            }
        }
        
        // Write modified content back to the file
        fs.writeFileSync(filePath, content);
        console.log(`Successfully fixed inventory display in ${filePath}`);
        return true;
        
    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error);
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

console.log(`Completed fixing inventory display in ${fixedCount} out of ${filesToFix.length} files.`); 