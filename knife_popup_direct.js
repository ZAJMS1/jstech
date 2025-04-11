const fs = require('fs');

try {
    const filePath = 'alternative.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add a completely standalone popup at the top of the body
    const bodyStartIndex = content.indexOf('<body>') + 6;
    
    // Create a standalone popup that doesn't rely on any other scripts
    const standalonePopup = `
    <!-- Direct Knife Popup -->
    <div id="direct-knife-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 10000; display: flex; justify-content: center; align-items: center;">
        <div id="direct-knife-popup" style="background-color: rgba(20, 20, 40, 0.95); color: white; padding: 30px; border-radius: 10px; text-align: center; z-index: 10001; border: 2px solid #73a1ff; box-shadow: 0 0 20px #73a1ff; width: 400px; max-width: 90%;">
            <h2 style="color: #73a1ff; margin-bottom: 20px;">Found Item</h2>
            <p style="margin-bottom: 25px; line-height: 1.5;">You notice a pocket knife on the ground. It might be useful for cutting through obstacles.</p>
            <div style="display: flex; justify-content: space-between; gap: 15px;">
                <button id="take-knife-btn" style="padding: 12px 20px; background-color: #3b6c4a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; flex: 1;">Take Knife</button>
                <button id="leave-knife-btn" style="padding: 12px 20px; background-color: #6c3b3b; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; flex: 1;">Leave It</button>
            </div>
        </div>
    </div>

    <script>
        // Direct script to handle knife popup choices
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
                // Hide popup
                backdrop.style.display = 'none';
            });
            
            leaveButton.addEventListener('click', function() {
                // Set flag to remove fence option
                localStorage.setItem('hasKnife', 'false');
                // Hide popup
                backdrop.style.display = 'none';
            });
            
            // Ensure popup is visible
            backdrop.style.display = 'flex';
        });
    </script>
`;
    
    // Insert the standalone popup at the beginning of the body
    content = content.substring(0, bodyStartIndex) + standalonePopup + content.substring(bodyStartIndex);
    
    // Remove any existing knife prompt code to avoid conflicts
    // Find the start of the knife prompt code block
    const existingKnifePromptIndex = content.indexOf('// Create knife prompt popup');
    if (existingKnifePromptIndex !== -1) {
        // Find the end of the code block (the line where it appends to document.body)
        const endOfKnifePromptIndex = content.indexOf('document.body.appendChild(knifePromptContainer);', existingKnifePromptIndex);
        if (endOfKnifePromptIndex !== -1) {
            // Find the end of that statement
            const endOfStatementIndex = content.indexOf(';', endOfKnifePromptIndex) + 1;
            
            // Skip any code between existingKnifePromptIndex and endOfStatementIndex
            let modifiedContent = content.substring(0, existingKnifePromptIndex);
            // Find the next line after the statement
            const nextLineIndex = content.indexOf('\n', endOfStatementIndex);
            modifiedContent += content.substring(nextLineIndex !== -1 ? nextLineIndex : endOfStatementIndex);
            
            content = modifiedContent;
        }
    }
    
    // Remove any window.onload handler we added previously
    const onloadHandlerIndex = content.indexOf('// Ensure knife popup appears even if DOM content loaded');
    if (onloadHandlerIndex !== -1) {
        const scriptStartIndex = content.lastIndexOf('<script>', onloadHandlerIndex);
        if (scriptStartIndex !== -1) {
            const scriptEndIndex = content.indexOf('</script>', onloadHandlerIndex);
            if (scriptEndIndex !== -1) {
                const endIndex = scriptEndIndex + 9; // Length of </script>
                content = content.substring(0, scriptStartIndex) + content.substring(endIndex);
            }
        }
    }
    
    // Also add condition to show "Cut through fence" option only if hasKnife is true
    const crowbarOptionText = content.indexOf('crowbarOption.textContent = \'Cut through fence');
    if (crowbarOptionText !== -1) {
        // Find where the option is added to the container
        const appendCrowbarIndex = content.indexOf('optionsContainer.appendChild(crowbarOption)', crowbarOptionText);
        if (appendCrowbarIndex !== -1) {
            // Get end of that line
            const appendEndIndex = content.indexOf(';', appendCrowbarIndex) + 1;
            
            // Replace with conditional statement
            const conditionalAppend = `// Only show fence cutting option if player has knife
                        if (localStorage.getItem('hasKnife') !== 'false') {
                            optionsContainer.appendChild(crowbarOption);
                        }`;
            
            content = content.substring(0, appendCrowbarIndex) + conditionalAppend + content.substring(appendEndIndex);
        }
    }
    
    // Write the modified content back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully added direct knife popup to alternative.html');
    
} catch (error) {
    console.error('Error adding direct knife popup:', error);
} 