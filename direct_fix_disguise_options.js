const fs = require('fs');

try {
    // Read the disguise.html file
    const filePath = 'disguise.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the border encounter function
    const functionStart = content.indexOf('function triggerBorderEncounter()');
    if (functionStart === -1) {
        throw new Error('Could not find triggerBorderEncounter function');
    }

    // Fix the description text - make it about the worker disguise
    const descriptionPattern = /description\.innerHTML = ['"].*?['"];/;
    const descriptionMatch = content.match(descriptionPattern);
    
    if (descriptionMatch) {
        content = content.replace(
            descriptionMatch[0],
            `description.innerHTML = 'You\\'ve chosen to use a worker disguise to get through the checkpoint. The forged worker ID in your pocket feels like a ticking time bomb, but it\\'s your best chance at passing inspection. Remember to act natural when approaching the guards - your success depends on looking the part of an ordinary factory worker.';`
        );
    }
    
    // Find all buttons in the page
    const buttons = [
        {
            name: 'disguiseOption',
            text: 'Bluff through checkpoint with forged papers',
            color: '#775599'
        },
        {
            name: 'sneakOption',
            text: 'Create a distraction with staged accident',
            color: '#997755'
        },
        {
            name: 'alternativeOption',
            text: 'Befriend a guard for inside help',
            color: '#557799'
        }
    ];
    
    // Update each button
    buttons.forEach(button => {
        // Find the button declaration
        const buttonPattern = new RegExp(`${button.name}\\.textContent = ['"].*?['"];`, 'g');
        const buttonMatches = [...content.matchAll(buttonPattern)];
        
        if (buttonMatches.length > 0) {
            // Use single quotes or double quotes based on the original
            const quoteChar = buttonMatches[0][0].includes('"') ? '"' : "'";
            const replacement = `${button.name}.textContent = ${quoteChar}${button.text}${quoteChar};`;
            
            // Replace all occurrences of this button text
            content = content.replace(buttonPattern, replacement);
            
            // Also update the button's color
            const stylePattern = new RegExp(`Object\\.assign\\(${button.name}\\.style, \\{[\\s\\S]*?backgroundColor: ['"]#[0-9a-f]{6}['"]`, 'g');
            const styleMatch = content.match(stylePattern);
            
            if (styleMatch) {
                const colorPattern = /backgroundColor: ['"]#[0-9a-f]{6}['"]/;
                const colorReplacement = `backgroundColor: '${button.color}'`;
                content = content.replace(styleMatch[0], styleMatch[0].replace(colorPattern, colorReplacement));
            }
        }
    });
    
    // Write the modified content back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully fixed the disguise page with correct options and description!');
    
} catch (error) {
    console.error('Error fixing disguise page:', error);
} 