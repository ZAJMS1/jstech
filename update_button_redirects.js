const fs = require('fs');

// Define the redirects for each page
const pageRedirects = [
  {
    sourcePage: 'disguise.html',
    redirects: [
      { optionText: 'Bluff through checkpoint with forged papers', targetPage: '/checkpoint' },
      { optionText: 'Create a distraction with staged accident', targetPage: '/accident' },
      { optionText: 'Befriend a guard for inside help', targetPage: '/guard' }
    ]
  },
  {
    sourcePage: 'sneak.html',
    redirects: [
      { optionText: 'Use darkness and shadows to slip past', targetPage: '/shadows' },
      { optionText: 'Steal guard uniforms to blend in', targetPage: '/uniforms' },
      { optionText: 'Sabotage cameras to create blind spots', targetPage: '/cameras' }
    ]
  },
  {
    sourcePage: 'alternative.html',
    redirects: [
      { optionText: 'Explore abandoned maintenance tunnels', targetPage: '/tunnels' },
      { optionText: 'Ride supply truck through delivery entrance', targetPage: '/truck' },
      { optionText: 'Cut through fence at unguarded section', targetPage: '/fence' }
    ]
  }
];

// Function to update the redirects in a file
function updateRedirectsInFile(pageConfig) {
  try {
    console.log(`Updating redirects in ${pageConfig.sourcePage}...`);
    
    // Read the source file
    const content = fs.readFileSync(pageConfig.sourcePage, 'utf8');
    
    // Find the triggerBorderEncounter function
    const encounterFunctionIndex = content.indexOf('function triggerBorderEncounter()');
    if (encounterFunctionIndex === -1) {
      throw new Error(`Could not find triggerBorderEncounter function in ${pageConfig.sourcePage}`);
    }
    
    // Make a copy of the content to modify
    let updatedContent = content;
    
    // Update each redirect
    for (const redirect of pageConfig.redirects) {
      // Find the button text
      const buttonTextIndex = updatedContent.indexOf(`${redirect.optionText}'`, encounterFunctionIndex);
      if (buttonTextIndex === -1) {
        console.log(`Warning: Could not find option text "${redirect.optionText}" in ${pageConfig.sourcePage}`);
        continue;
      }
      
      // Find the window.location.href line after the button text
      const locationHrefStartIndex = updatedContent.indexOf('window.location.href =', buttonTextIndex);
      if (locationHrefStartIndex === -1) {
        console.log(`Warning: Could not find redirect for "${redirect.optionText}" in ${pageConfig.sourcePage}`);
        continue;
      }
      
      // Find the end of the redirect statement
      const locationHrefEndIndex = updatedContent.indexOf(';', locationHrefStartIndex);
      if (locationHrefEndIndex === -1) {
        console.log(`Warning: Could not find end of redirect statement for "${redirect.optionText}" in ${pageConfig.sourcePage}`);
        continue;
      }
      
      // Get the entire redirect statement
      const originalRedirect = updatedContent.substring(locationHrefStartIndex, locationHrefEndIndex + 1);
      
      // Create the new redirect statement
      const newRedirect = `window.location.href = '${redirect.targetPage}';`;
      
      // Replace the redirect in the content
      updatedContent = updatedContent.replace(originalRedirect, newRedirect);
      
      console.log(`Updated redirect for "${redirect.optionText}" to "${redirect.targetPage}"`);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(pageConfig.sourcePage, updatedContent);
    
    console.log(`Successfully updated redirects in ${pageConfig.sourcePage}`);
    return true;
  } catch (error) {
    console.error(`Error updating redirects in ${pageConfig.sourcePage}:`, error);
    return false;
  }
}

// Main function to update all redirects
function updateAllRedirects() {
  console.log('Updating button redirects for all pages...');
  
  // Process each page configuration
  for (const pageConfig of pageRedirects) {
    if (!fs.existsSync(pageConfig.sourcePage)) {
      console.error(`Source file ${pageConfig.sourcePage} not found`);
      continue;
    }
    
    updateRedirectsInFile(pageConfig);
  }
  
  console.log('Finished updating button redirects for all pages');
}

// Run the main function
updateAllRedirects(); 