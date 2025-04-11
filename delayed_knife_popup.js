const fs = require('fs');

try {
    const filePath = 'alternative.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the existing direct knife popup script
    const scriptIndex = content.indexOf('// Direct script to handle knife popup choices');
    
    if (scriptIndex === -1) {
        throw new Error('Could not find the knife popup script');
    }
    
    // Find the beginning of the script tag
    const scriptTagIndex = content.lastIndexOf('<script>', scriptIndex);
    
    if (scriptTagIndex === -1) {
        throw new Error('Could not find the script tag for the knife popup');
    }
    
    // Find the end of the script tag
    const scriptEndTagIndex = content.indexOf('</script>', scriptIndex);
    
    if (scriptEndTagIndex === -1) {
        throw new Error('Could not find the end script tag for the knife popup');
    }
    
    // Get the entire script content
    const originalScriptContent = content.substring(scriptTagIndex, scriptEndTagIndex + 9);
    
    // Initial setting for backdrop - set to hidden
    // Find the backdrop div
    const backdropIndex = content.indexOf('id="direct-knife-backdrop"');
    if (backdropIndex !== -1) {
        // Find style attribute
        const styleIndex = content.indexOf('style="', backdropIndex);
        if (styleIndex !== -1) {
            // Find the end of the style attribute
            const styleEndIndex = content.indexOf('"', styleIndex + 7);
            if (styleEndIndex !== -1) {
                // Get current style
                const currentStyle = content.substring(styleIndex + 7, styleEndIndex);
                // Replace display:flex with display:none
                const newStyle = currentStyle.replace('display: flex;', 'display: none;');
                // Update the content
                content = content.substring(0, styleIndex + 7) + newStyle + content.substring(styleEndIndex);
            }
        }
    }
    
    // Create the modified script with a delay
    const modifiedScript = `<script>
        // Direct script to handle knife popup choices with delay
        document.addEventListener('DOMContentLoaded', function() {
            const backdrop = document.getElementById('direct-knife-backdrop');
            const takeButton = document.getElementById('take-knife-btn');
            const leaveButton = document.getElementById('leave-knife-btn');
            
            if (!backdrop || !takeButton || !leaveButton) {
                console.error('Knife popup elements not found');
                return;
            }
            
            takeButton.addEventListener('click', function() {
                // Add knife to inventory if playerInventory exists
                if (window.playerInventory) {
                    window.playerInventory.addItem('Pocket Knife', 'A small but sharp knife, useful for cutting through various materials.');
                }
                // Save choice to localStorage
                localStorage.setItem('hasKnife', 'true');
                // Hide popup with fade out effect
                backdrop.style.opacity = '0';
                setTimeout(() => {
                    backdrop.style.display = 'none';
                }, 500);
            });
            
            leaveButton.addEventListener('click', function() {
                // Set flag to remove fence option
                localStorage.setItem('hasKnife', 'false');
                // Hide popup with fade out effect
                backdrop.style.opacity = '0';
                setTimeout(() => {
                    backdrop.style.display = 'none';
                }, 500);
            });
            
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
        });
    </script>`;
    
    // Replace the original script with the modified one
    content = content.replace(originalScriptContent, modifiedScript);
    
    // Write the modified content back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully added delay to knife popup in alternative.html');
    
} catch (error) {
    console.error('Error adding delay to knife popup:', error);
} 