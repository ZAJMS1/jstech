// Script to add inventory persistence across pages using localStorage
const fs = require('fs');

const files = ['game.html', 'sneak.html', 'alternative.html', 'disguise.html'];

// The updated inventory system code with localStorage persistence
const inventorySystemCode = `
                // Initialize inventory system
                function initInventorySystem() {
                    // Load existing inventory from localStorage if available
                    let savedInventory = localStorage.getItem('gameInventory');
                    let savedBackpack = localStorage.getItem('hasBackpack');
                    
                    // Create inventory manager
                    window.playerInventory = {
                        items: savedInventory ? JSON.parse(savedInventory) : [],
                        
                        addItem: function(name, description) {
                            // Check if item already exists to prevent duplicates
                            if (!this.hasItem(name)) {
                                this.items.push({
                                    name: name,
                                    description: description,
                                    used: false
                                });
                                this.saveInventory();
                                this.updateUI();
                            }
                        },
                        
                        useItem: function(index) {
                            if (index >= 0 && index < this.items.length) {
                                this.items[index].used = true;
                                this.saveInventory();
                                this.updateUI();
                                return true;
                            }
                            return false;
                        },
                        
                        hasItem: function(name) {
                            return this.items.some(item => item.name === name && !item.used);
                        },
                        
                        saveInventory: function() {
                            // Save inventory to localStorage
                            localStorage.setItem('gameInventory', JSON.stringify(this.items));
                            // Save backpack status
                            localStorage.setItem('hasBackpack', gameProgress.hasBackpack);
                        },
                        
                        clearInventory: function() {
                            // Clear inventory (for game restart)
                            this.items = [];
                            localStorage.removeItem('gameInventory');
                            localStorage.removeItem('hasBackpack');
                            this.updateUI();
                        },
                        
                        showUI: function(visible) {
                            const inventoryUI = document.getElementById('inventory-ui');
                            if (inventoryUI) {
                                inventoryUI.style.display = visible ? 'block' : 'none';
                            }
                        },
                        
                        updateUI: function() {
                            let inventoryUI = document.getElementById('inventory-ui');
                            if (!inventoryUI) {
                                inventoryUI = document.createElement('div');
                                inventoryUI.id = 'inventory-ui';
                                inventoryUI.style.position = 'absolute';
                                inventoryUI.style.top = '10px';
                                inventoryUI.style.right = '10px';
                                inventoryUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                                inventoryUI.style.color = 'white';
                                inventoryUI.style.padding = '10px';
                                inventoryUI.style.borderRadius = '5px';
                                inventoryUI.style.maxWidth = '250px';
                                inventoryUI.style.zIndex = '999';
                                document.body.appendChild(inventoryUI);
                            }
                            
                            // Update inventory display
                            let itemsHtml = '<h3 style="margin-top:0">Inventory</h3>';
                            if (this.items.length === 0) {
                                itemsHtml += '<p>No items</p>';
                            } else {
                                itemsHtml += '<ul style="padding-left:20px;margin:0">';
                                this.items.forEach((item, index) => {
                                    if (!item.used) {
                                        itemsHtml += \`<li>\${item.name}</li>\`;
                                    }
                                });
                                itemsHtml += '</ul>';
                            }
                            inventoryUI.innerHTML = itemsHtml;
                        }
                    };
                    
                    // Initialize empty inventory UI
                    window.playerInventory.updateUI();
                    window.playerInventory.showUI(false); // Hide initially
                    
                    // If we have a saved backpack status, apply it
                    if (savedBackpack !== null) {
                        gameProgress.hasBackpack = savedBackpack === 'true';
                    }
                }`;

// Code to modify game.html to update the startGame function to save inventory state
const gameHtmlStartGameCode = `
                // Start the actual game
                function startGame(hasBackpack) {
                    // Remove choice UI
                    const choiceContainer = document.getElementById('choice-container');
                    if (choiceContainer) {
                        choiceContainer.remove();
                    }
                    
                    // Set game progression
                    gameProgress.hasBackpack = hasBackpack;
                    gameProgress.storyPhase = 'escape';
                    
                    // Save backpack status to localStorage
                    localStorage.setItem('hasBackpack', hasBackpack);
                    
                    // Add items to inventory based on backpack choice
                    if (window.playerInventory) {
                        // Clear previous inventory in case of restart
                        window.playerInventory.clearInventory();
                        
                        if (hasBackpack) {
                            window.playerInventory.addItem('Crowbar', 'A sturdy metal tool that can force doors and serve as a weapon.');
                            window.playerInventory.addItem('Sandwich', 'A homemade sandwich. Can restore energy or be shared.');
                        }
                        window.playerInventory.showUI(hasBackpack);
                    }
                    
                    // Enable player controls
                    blocker.style.display = 'flex';
                    
                    // Log game start
                    console.log(\`Game started with backpack: \${hasBackpack}\`);`;

// Update the DOMContentLoaded event handler in the other HTML files to restore inventory items
const otherFilesInventoryCode = `
                // Add specific items for this scenario
                document.addEventListener('DOMContentLoaded', function() {
                    // Unlock controls immediately
                    blocker.style.display = 'flex';
                    instructions.style.display = '';
                    
                    // Position player at the border checkpoint area
                    player.position.set(0, 1, 50); // Starting position adjusted (outside)
                    
                    // Check localStorage for backpack status and restore inventory
                    const hasBackpack = localStorage.getItem('hasBackpack') === 'true';
                    gameProgress.hasBackpack = hasBackpack;
                    
                    // If this page is loaded directly without coming from game.html, 
                    // we need to ensure the player has the right items
                    if (window.playerInventory) {
                        if (hasBackpack) {
                            window.playerInventory.addItem('Crowbar', 'A sturdy metal tool that can force doors and serve as a weapon.');`;

// Special additions for disguse.html which should have a Worker ID
const disguiseSpecificCode = `
                            // For disguise scenario, add Worker ID
                            window.playerInventory.addItem('Worker ID', 'Forged worker identification that might pass a quick inspection.');`;

// End of the DOMContentLoaded event handler
const domContentLoadedEnd = `
                        }
                        window.playerInventory.showUI(hasBackpack);
                    }`;

// Add code to clear localStorage when restarting or losing
const clearInventoryOnRestartCode = `
                // Add event listeners to restart buttons to clear inventory
                document.querySelectorAll('.restart-game, #restart-game').forEach(button => {
                    button.addEventListener('click', function() {
                        // Clear localStorage before restarting
                        localStorage.removeItem('gameInventory');
                        localStorage.removeItem('hasBackpack');
                        console.log('Game restarting, inventory cleared');
                    });
                });`;

files.forEach(file => {
  try {
    console.log(`Adding inventory persistence to ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace inventory system with persistent version
    const inventorySystemPattern = /function initInventorySystem\(\) \{[\s\S]*?window\.playerInventory\.showUI\(false\); \/\/ Hide initially[\s\S]*?\}/;
    if (content.match(inventorySystemPattern)) {
      content = content.replace(inventorySystemPattern, inventorySystemCode);
      console.log(`Updated inventory system in ${file}`);
    }
    
    // If this is game.html, update the startGame function
    if (file === 'game.html') {
      const startGamePattern = /function startGame\(hasBackpack\) \{[\s\S]*?console\.log\(\`Game started with backpack: \${hasBackpack}\`\);/;
      if (content.match(startGamePattern)) {
        content = content.replace(startGamePattern, gameHtmlStartGameCode);
        console.log(`Updated startGame function in ${file}`);
      }
    } else {
      // For other HTML files, update the DOMContentLoaded event handler
      const domContentLoadedPattern = /document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?player\.position\.set\([^)]+\);/;
      if (content.match(domContentLoadedPattern)) {
        content = content.replace(domContentLoadedPattern, otherFilesInventoryCode);
        console.log(`Updated DOMContentLoaded event handler in ${file}`);
        
        // Add disguise-specific code if needed
        if (file === 'disguise.html') {
          // Find where to insert the Worker ID code
          const addItemPattern = /window\.playerInventory\.addItem\('Crowbar', '[^']+'\);/;
          if (content.match(addItemPattern)) {
            content = content.replace(addItemPattern, match => match + disguiseSpecificCode);
            console.log(`Added Worker ID to disguise.html`);
          }
        }
        
        // Add the end of the DOMContentLoaded event handler
        const messagePattern = /setTimeout\(\(\) => \{\s+\w+Message\.remove\(\);\s+\}, \d+\);\s+\}, \d+\);/;
        if (content.match(messagePattern)) {
          content = content.replace(messagePattern, match => match + domContentLoadedEnd);
          console.log(`Added end of DOMContentLoaded handler in ${file}`);
        }
      }
    }
    
    // Add code to clear inventory on restart for all files
    const beforeClosingScriptTag = /<\/script>/;
    if (content.match(beforeClosingScriptTag)) {
      content = content.replace(beforeClosingScriptTag, clearInventoryOnRestartCode + '\n    </script>');
      console.log(`Added inventory clearing on restart to ${file}`);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated ${file}`);
  } catch (error) {
    console.error(`Error updating ${file}:`, error);
  }
});

console.log('Finished adding inventory persistence to all files.'); 