const fs = require('fs');

try {
    const filePath = 'alternative.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find where to add our popup code - after DOMContentLoaded but before other initialization
    const domLoadedIndex = content.indexOf('document.addEventListener(\'DOMContentLoaded\', function() {', 1000);
    if (domLoadedIndex === -1) {
        throw new Error('Could not find DOMContentLoaded event handler');
    }
    
    // Find the opening bracket for the DOMContentLoaded function
    const openingBracketIndex = content.indexOf('{', domLoadedIndex);
    const insertPosition = openingBracketIndex + 1;
    
    // Create the knife prompt popup code
    const knifePromptCode = `
    // Create knife prompt popup
    const knifePromptContainer = document.createElement('div');
    knifePromptContainer.id = 'knife-prompt';
    
    // Set styles for the container
    Object.assign(knifePromptContainer.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(20, 20, 40, 0.9)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: '2000',
        border: '2px solid #73a1ff',
        boxShadow: '0 0 20px #73a1ff',
        width: '400px'
    });
    
    // Create content
    const title = document.createElement('h2');
    title.textContent = 'Found Item';
    title.style.color = '#73a1ff';
    title.style.marginBottom = '20px';
    
    const description = document.createElement('p');
    description.textContent = 'You notice a pocket knife on the ground. It might be useful for cutting through obstacles.';
    description.style.marginBottom = '25px';
    description.style.lineHeight = '1.5';
    
    const optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'flex';
    optionsContainer.style.justifyContent = 'space-between';
    optionsContainer.style.gap = '15px';
    
    // Yes button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Take Knife';
    Object.assign(yesButton.style, {
        padding: '12px 20px',
        backgroundColor: '#3b6c4a',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        flex: '1'
    });
    
    // No button
    const noButton = document.createElement('button');
    noButton.textContent = 'Leave It';
    Object.assign(noButton.style, {
        padding: '12px 20px',
        backgroundColor: '#6c3b3b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        flex: '1'
    });
    
    // Add click handlers
    yesButton.addEventListener('click', function() {
        // Add knife to inventory
        if (window.playerInventory) {
            window.playerInventory.addItem('Pocket Knife', 'A small but sharp knife, useful for cutting through various materials.');
            // Also save knife status to localStorage
            localStorage.setItem('hasKnife', 'true');
        }
        knifePromptContainer.style.display = 'none';
    });
    
    noButton.addEventListener('click', function() {
        // Set flag to remove fence option
        localStorage.setItem('hasKnife', 'false');
        knifePromptContainer.style.display = 'none';
    });
    
    // Assemble the popup
    optionsContainer.appendChild(yesButton);
    optionsContainer.appendChild(noButton);
    knifePromptContainer.appendChild(title);
    knifePromptContainer.appendChild(description);
    knifePromptContainer.appendChild(optionsContainer);
    
    // Add to document
    document.body.appendChild(knifePromptContainer);`;
    
    // Insert the knife prompt code
    content = content.substring(0, insertPosition) + knifePromptCode + content.substring(insertPosition);
    
    // Now modify the border encounter function to check for hasKnife
    const borderEncounterIndex = content.indexOf('function triggerBorderEncounter()');
    if (borderEncounterIndex === -1) {
        throw new Error('Could not find triggerBorderEncounter function');
    }
    
    // Find where the crowbarOption is defined
    const crowbarOptionIndex = content.indexOf('crowbarOption.textContent = \'Cut through fence', borderEncounterIndex);
    if (crowbarOptionIndex === -1) {
        throw new Error('Could not find fence cutting option');
    }
    
    // Find the section where the crowbarOption is appended to options container
    const appendCrowbarIndex = content.indexOf('optionsContainer.appendChild(crowbarOption)', crowbarOptionIndex);
    if (appendCrowbarIndex === -1) {
        throw new Error('Could not find where crowbar option is appended');
    }
    
    // Get the full append statement
    const appendEndIndex = content.indexOf(';', appendCrowbarIndex) + 1;
    const appendStatement = content.substring(appendCrowbarIndex, appendEndIndex);
    
    // Replace with conditional append
    const conditionalAppend = `// Only show fence cutting option if player has knife
        if (localStorage.getItem('hasKnife') !== 'false') {
            optionsContainer.appendChild(crowbarOption);
        }`;
    
    // Replace the append statement
    content = content.substring(0, appendCrowbarIndex) + conditionalAppend + content.substring(appendEndIndex);
    
    // Write the changes back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully added knife prompt and conditional fence option to alternative.html');
    
} catch (error) {
    console.error('Error updating alternative.html:', error);
} 