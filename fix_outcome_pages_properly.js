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
    if (content.includes('// Direct border encounter trigger')) {
      console.log(`${pagePath} already fixed, skipping.`);
      return true;
    }
    
    // Find the closing </body> tag to insert our script before it
    const closingBodyIndex = content.lastIndexOf('</body>');
    
    if (closingBodyIndex === -1) {
      console.log(`Warning: Could not find closing body tag in ${pagePath}`);
      return false;
    }
    
    // Create a script to run after the page is fully loaded
    const autoTriggerScript = `
<script>
// Direct border encounter trigger
document.addEventListener('DOMContentLoaded', function() {
  // Ensure game progress is properly set up
  if (typeof window.gameProgress === 'undefined') {
    window.gameProgress = {
      eventInProgress: false,
      borderReached: false,
      storyPhase: 'border',
      hasBackpack: localStorage.getItem('hasBackpack') === 'true'
    };
  }
  
  // Fix displayMessage function if it doesn't exist
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
  };
  
  // Wait a little longer for all scripts to load and functions to be defined
  setTimeout(function() {
    console.log("Trigger timeout executed...");
    
    // Check if the function exists
    if (typeof window.triggerBorderEncounter === 'function') {
      console.log("Function found, triggering border encounter...");
      window.triggerBorderEncounter();
    } else {
      console.error("triggerBorderEncounter function not found!");
      
      // Manual implementation of the encounter UI as a fallback
      const encounterContainer = document.createElement('div');
      encounterContainer.id = 'border-encounter';
      
      Object.assign(encounterContainer.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: '1000'
      });
      
      // Add a fallback message
      const fallbackMessage = document.createElement('div');
      fallbackMessage.innerHTML = '<h2>Loading error</h2><p>We encountered an issue loading this page properly. Please go back and try again.</p>';
      
      // Add a back button
      const backButton = document.createElement('button');
      backButton.textContent = 'Go Back';
      backButton.style.padding = '10px 20px';
      backButton.style.backgroundColor = '#445577';
      backButton.style.color = 'white';
      backButton.style.border = 'none';
      backButton.style.borderRadius = '5px';
      backButton.style.cursor = 'pointer';
      backButton.style.fontSize = '16px';
      backButton.style.marginTop = '20px';
      
      backButton.addEventListener('click', function() {
        window.location.href = '/game';
      });
      
      // Assemble and add to the page
      fallbackMessage.appendChild(backButton);
      encounterContainer.appendChild(fallbackMessage);
      document.body.appendChild(encounterContainer);
    }
  }, 1000); // Wait 1 second to ensure everything is loaded
  
  // Safety fallback - if nothing appears after 5 seconds, redirect
  setTimeout(function() {
    if (!document.getElementById('border-encounter')) {
      console.warn("No encounter UI detected after 5 seconds, redirecting...");
      window.location.href = '/game';
    }
  }, 5000);
});
</script>`;
    
    // Insert the auto-trigger script before the closing body tag
    const updatedContent = 
      content.substring(0, closingBodyIndex) + 
      autoTriggerScript + 
      content.substring(closingBodyIndex);
    
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