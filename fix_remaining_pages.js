const fs = require('fs');
const path = require('path');

// List of remaining pages that need fixing
const problemPages = [
  'shadows.html', 'uniforms.html', 'cameras.html'
];

// Function to add auto-trigger to a page using an alternative method
function fixProblemPage(pagePath) {
  try {
    console.log(`Fixing problem page ${pagePath}...`);
    
    // Read the page content
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if the page already has the fix
    if (content.includes('// Direct border encounter trigger')) {
      console.log(`${pagePath} already fixed, skipping.`);
      return true;
    }
    
    // Find the end of the file to insert our script there
    // If we can't find the closing body tag, we'll just add our script to the end of the file
    
    // Create a script to run after the page is fully loaded
    const autoTriggerScript = `
<!-- Auto-fix for page loading issues -->
<script>
// Direct border encounter trigger
window.addEventListener('load', function() {
  console.log("Window load event fired, checking for encounter trigger...");
  
  // Ensure game progress is properly set up
  if (typeof window.gameProgress === 'undefined') {
    window.gameProgress = {
      eventInProgress: false,
      borderReached: false,
      storyPhase: 'border',
      hasBackpack: localStorage.getItem('hasBackpack') === 'true'
    };
  }
  
  // Define displayMessage if it doesn't exist
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
  
  // Define blocker variable if it's undefined
  if (typeof window.blocker === 'undefined') {
    window.blocker = document.createElement('div');
    window.blocker.id = 'blocker';
    document.body.appendChild(window.blocker);
  }
  
  // Try to directly define the border encounter function if it's missing
  if (typeof window.triggerBorderEncounter !== 'function') {
    window.triggerBorderEncounter = function() {
      console.log("Using fallback triggerBorderEncounter implementation");
      
      // Prevent multiple trigger
      if (window.gameProgress.eventInProgress) return;
      window.gameProgress.eventInProgress = true;
      
      // Disable player controls if they exist
      if (window.blocker) {
        window.blocker.style.display = 'none';
      }
      
      // Create border checkpoint UI
      const encounterContainer = document.createElement('div');
      encounterContainer.id = 'border-encounter';
      
      // Set styles
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
        zIndex: '1000',
        opacity: '1',
        transition: 'opacity 0.3s ease-in'
      });
      
      // Add a fallback message and button to go back
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
    };
  }
  
  // Wait a short time then trigger the encounter
  setTimeout(function() {
    console.log("Attempting to trigger border encounter...");
    try {
      window.triggerBorderEncounter();
    } catch (error) {
      console.error("Error in triggerBorderEncounter:", error);
      // Fallback to go to the main game
      setTimeout(function() {
        window.location.href = '/game';
      }, 3000);
    }
  }, 500);
  
  // Safety fallback - if nothing appears after 5 seconds, redirect
  setTimeout(function() {
    if (!document.getElementById('border-encounter')) {
      console.warn("No encounter UI detected after 5 seconds, redirecting...");
      window.location.href = '/game';
    }
  }, 5000);
});
</script>
`;
    
    // Add the script to the end of the content
    const updatedContent = content + autoTriggerScript;
    
    // Write the updated content back to the file
    fs.writeFileSync(pagePath, updatedContent);
    
    console.log(`Successfully fixed ${pagePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${pagePath}:`, error);
    return false;
  }
}

// Main function to fix the remaining problem pages
function fixRemainingPages() {
  console.log('Fixing remaining problem pages...');
  
  // Process each problem page
  let fixedCount = 0;
  
  for (const pagePath of problemPages) {
    if (!fs.existsSync(pagePath)) {
      console.error(`Page file ${pagePath} not found`);
      continue;
    }
    
    if (fixProblemPage(pagePath)) {
      fixedCount++;
    }
  }
  
  console.log(`Finished fixing ${fixedCount} out of ${problemPages.length} problem pages`);
}

// Run the main function
fixRemainingPages(); 