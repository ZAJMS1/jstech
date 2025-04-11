const fs = require('fs');
const files = ['truck.html', 'tunnels.html'];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the start of the popup timer code
    const startIndex = content.indexOf('// Show the popup after a 2 second delay');
    if (startIndex === -1) {
      console.error(`Could not find popup timer in ${file}`);
      return;
    }
    
    // Find the end of the popup timer code (closing of setTimeout)
    const endIndex = content.indexOf('}, 2000); // 2 second delay', startIndex);
    if (endIndex === -1) {
      console.error(`Could not find end of popup timer in ${file}`);
      return;
    }
    
    // Extract the existing popup timer code
    const popupTimerCode = content.substring(startIndex, endIndex + 29);
    
    // Replace with conditional code
    const replacementCode = `// Only show the popup on alternative.html page
            // Get the current page path
            const currentPath = window.location.pathname;
            // Check if this is alternative.html
            if (currentPath.includes('alternative') || currentPath.endsWith('/alternative')) {
                // Show the popup after a 2 second delay
                setTimeout(() => {
                    // Add transition for smooth appearance
                    backdrop.style.transition = 'opacity 0.5s ease-in-out';
                    backdrop.style.opacity = '0';
                    backdrop.style.display = 'flex';
                    
                    // Force reflow then fade in
                    setTimeout(() => {
                        backdrop.style.opacity = '1';
                    }, 50);
                }, 2000); // 2 second delay
            }`;
    
    // Replace the code
    const updatedContent = content.replace(popupTimerCode, replacementCode);
    
    // Write the updated content back to the file
    fs.writeFileSync(file, updatedContent, 'utf8');
    
    console.log(`Updated ${file} successfully`);
  } catch (error) {
    console.error(`Error updating ${file}:`, error);
  }
}); 