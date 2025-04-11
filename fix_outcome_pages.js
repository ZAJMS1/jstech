const fs = require('fs');
const path = require('path');

// List of outcome pages that need fixing
const outcomePages = [
  'checkpoint.html', 'accident.html', 'guard.html',
  'shadows.html', 'uniforms.html', 'cameras.html',
  'tunnels.html', 'truck.html', 'fence.html'
];

// Function to add auto-trigger to a page
function fixOutcomePage(pagePath) {
  try {
    console.log(`Fixing loading issue in ${pagePath}...`);
    
    // Read the page content
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if the page already has the fix
    if (content.includes('// Auto-trigger border encounter')) {
      console.log(`${pagePath} already fixed, skipping.`);
      return true;
    }
    
    // Find the DOMContentLoaded event handler
    const domContentLoadedIndex = content.indexOf("document.addEventListener('DOMContentLoaded', function() {");
    
    if (domContentLoadedIndex === -1) {
      console.log(`Warning: Could not find DOMContentLoaded event in ${pagePath}`);
      return false;
    }
    
    // Find the opening bracket of the function
    const openingBracketIndex = content.indexOf('{', domContentLoadedIndex);
    const insertPosition = openingBracketIndex + 1;
    
    // Create code to auto-trigger the border encounter
    const autoTriggerCode = `
    // Auto-trigger border encounter
    setTimeout(() => {
      // Ensure game progress is properly set up
      if (typeof gameProgress === 'undefined') {
        window.gameProgress = {
          eventInProgress: false,
          borderReached: false,
          storyPhase: 'border',
          hasBackpack: localStorage.getItem('hasBackpack') === 'true'
        };
      }
      
      // Force trigger the border encounter directly
      console.log("Auto-triggering border encounter...");
      try {
        triggerBorderEncounter();
      } catch (error) {
        console.error("Error triggering border encounter:", error);
        
        // Fallback mechanism to go back to the main game if the page doesn't load
        setTimeout(() => {
          if (!document.getElementById('border-encounter')) {
            console.warn("Border encounter didn't appear, redirecting to game...");
            window.location.href = '/game';
          }
        }, 5000); // Wait 5 seconds before fallback redirect
      }
    }, 500); // Small delay to ensure page is loaded
    
    // Fix any displayMessage function issues
    window.displayMessage = window.displayMessage || function(message, duration) {
      console.log("Message:", message);
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      messageElement.style.position = 'absolute';
      messageElement.style.top = '10px';
      messageElement.style.left = '50%';
      messageElement.style.transform = 'translateX(-50%)';
      messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      messageElement.style.color = 'white';
      messageElement.style.padding = '10px 20px';
      messageElement.style.borderRadius = '5px';
      messageElement.style.fontFamily = 'Courier New, monospace';
      messageElement.style.fontSize = '16px';
      messageElement.style.zIndex = '100';
      document.body.appendChild(messageElement);
      
      setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 1s';
        setTimeout(() => messageElement.remove(), 1000);
      }, duration || 3000);
    };`;
    
    // Insert the auto-trigger code at the beginning of the DOMContentLoaded function
    const updatedContent = 
      content.substring(0, insertPosition) + 
      autoTriggerCode + 
      content.substring(insertPosition);
    
    // Write the updated content back to the file
    fs.writeFileSync(pagePath, updatedContent);
    
    console.log(`Successfully fixed ${pagePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${pagePath}:`, error);
    return false;
  }
}

// Main function to fix all outcome pages
function fixAllOutcomePages() {
  console.log('Fixing loading issues in outcome pages...');
  
  // Process each outcome page
  let fixedCount = 0;
  
  for (const pagePath of outcomePages) {
    if (!fs.existsSync(pagePath)) {
      console.error(`Page file ${pagePath} not found`);
      continue;
    }
    
    if (fixOutcomePage(pagePath)) {
      fixedCount++;
    }
  }
  
  console.log(`Finished fixing ${fixedCount} out of ${outcomePages.length} outcome pages`);
}

// Run the main function
fixAllOutcomePages(); 