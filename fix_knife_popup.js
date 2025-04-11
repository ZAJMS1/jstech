const fs = require('fs');

try {
    const filePath = 'alternative.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the knifePromptContainer creation
    const knifePromptIndex = content.indexOf('const knifePromptContainer = document.createElement(\'div\');');
    if (knifePromptIndex === -1) {
        throw new Error('Could not find knife prompt container creation');
    }
    
    // Find where we add the knife prompt to the document
    const appendPromptIndex = content.indexOf('document.body.appendChild(knifePromptContainer);', knifePromptIndex);
    if (appendPromptIndex === -1) {
        throw new Error('Could not find where knife prompt is appended to document');
    }
    
    // Find the end of the statement
    const appendEndIndex = content.indexOf(';', appendPromptIndex) + 1;
    
    // Replace with improved code that ensures the popup is visible
    const improvedAppend = `document.body.appendChild(knifePromptContainer);
    
    // Make sure the knife prompt is visible and appears on top of everything
    // Use setTimeout to ensure it's added after all other elements
    setTimeout(() => {
        // Force the prompt to be visible
        knifePromptContainer.style.zIndex = '9999';
        
        // Add a backdrop to make it more visible
        const backdrop = document.createElement('div');
        backdrop.id = 'knife-prompt-backdrop';
        Object.assign(backdrop.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: '9998'
        });
        document.body.insertBefore(backdrop, knifePromptContainer);
        
        // Add a close event for the backdrop
        backdrop.addEventListener('click', function(e) {
            if (e.target === backdrop) {
                // If they click outside, default to not taking the knife
                localStorage.setItem('hasKnife', 'false');
                backdrop.remove();
                knifePromptContainer.style.display = 'none';
            }
        });
        
        // Update button event handlers to remove backdrop
        const yesButton = knifePromptContainer.querySelector('button:first-of-type');
        const noButton = knifePromptContainer.querySelector('button:last-of-type');
        
        const originalYesHandler = yesButton.onclick;
        yesButton.onclick = function() {
            backdrop.remove();
            if (originalYesHandler) originalYesHandler.call(this);
        };
        
        const originalNoHandler = noButton.onclick;
        noButton.onclick = function() {
            backdrop.remove();
            if (originalNoHandler) originalNoHandler.call(this);
        };
    }, 500);`;
    
    // Replace the original append statement
    content = content.substring(0, appendPromptIndex) + improvedAppend + content.substring(appendEndIndex);
    
    // Find the button click handlers and modify them
    const yesButtonClickIndex = content.indexOf('yesButton.addEventListener(\'click\', function() {');
    const noButtonClickIndex = content.indexOf('noButton.addEventListener(\'click\', function() {');
    
    if (yesButtonClickIndex !== -1 && noButtonClickIndex !== -1) {
        // We found the button handlers, but we'll leave them alone as we're now handling
        // backdrop removal in the improved code above
    }
    
    // Fix any potential issues with DOMContentLoaded vs window.onload timing
    // Find the knife prompt creation
    const domContentLoadedIndex = content.indexOf('document.addEventListener(\'DOMContentLoaded\', function() {');
    
    if (domContentLoadedIndex !== -1) {
        // Add a direct window.onload handler to ensure the knife prompt is shown
        // This separate handler will run after everything else is loaded
        const scriptEndIndex = content.lastIndexOf('</script>');
        
        if (scriptEndIndex !== -1) {
            const additionalHandler = `
<script>
// Ensure knife popup appears even if DOM content loaded but images or resources are still loading
window.onload = function() {
    // Check if knife prompt exists
    const knifePrompt = document.getElementById('knife-prompt');
    const backdrop = document.getElementById('knife-prompt-backdrop');
    
    // If neither exists, the prompt hasn't been created yet or was already closed
    if (!knifePrompt && !backdrop) {
        console.log("Knife prompt not found, might have been closed already");
        return;
    }
    
    // Make sure the knife prompt and backdrop are visible
    if (knifePrompt) {
        knifePrompt.style.zIndex = '9999';
        knifePrompt.style.display = 'block';
    }
    
    if (!backdrop) {
        // Create backdrop if it doesn't exist
        const newBackdrop = document.createElement('div');
        newBackdrop.id = 'knife-prompt-backdrop';
        Object.assign(newBackdrop.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: '9998'
        });
        
        // Insert before knife prompt if it exists
        if (knifePrompt) {
            document.body.insertBefore(newBackdrop, knifePrompt);
        } else {
            document.body.appendChild(newBackdrop);
        }
    }
};
</script>`;
            
            // Insert the additional handler before the closing body tag
            const bodyCloseIndex = content.lastIndexOf('</body>');
            if (bodyCloseIndex !== -1) {
                content = content.substring(0, bodyCloseIndex) + additionalHandler + content.substring(bodyCloseIndex);
            }
        }
    }
    
    // Write the changes back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully fixed knife prompt visibility in alternative.html');
    
} catch (error) {
    console.error('Error fixing knife prompt:', error);
} 