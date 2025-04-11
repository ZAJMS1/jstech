const fs = require('fs');

try {
    const filePath = 'sneak.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the stealth encounter section
    const encounterSection = content.indexOf('function triggerBorderEncounter()');
    if (encounterSection === -1) {
        throw new Error('Could not find border encounter function');
    }
    
    // Define the correct buttons and their colors
    const correctButtons = [
        {
            id: 'sneakOption',
            text: 'Use darkness and shadows to slip past',
            color: '#445577'
        },
        {
            id: 'alternativeOption',
            text: 'Sabotage cameras to create blind spots',
            color: '#557755'
        },
        {
            id: 'crowbarOption',
            text: 'Steal guard uniforms to blend in',
            color: '#997755'
        }
    ];
    
    let modified = false;
    
    // Fix the crowbarOption text - this is the one with the duplicate text
    const crowbarOptionSection = content.indexOf('crowbarOption.textContent =', encounterSection);
    
    if (crowbarOptionSection !== -1) {
        // Extract the current line
        const lineEnd = content.indexOf(';', crowbarOptionSection) + 1;
        const currentLine = content.substring(crowbarOptionSection, lineEnd);
        
        // Replace with correct text
        const correctLine = `crowbarOption.textContent = '${correctButtons[2].text}'`;
        
        if (!currentLine.includes(correctButtons[2].text)) {
            content = content.substring(0, crowbarOptionSection) + correctLine + content.substring(lineEnd);
            modified = true;
            console.log('Fixed crowbarOption text');
        }
    }
    
    // Also check and fix the other buttons if needed
    correctButtons.forEach(button => {
        if (button.id === 'crowbarOption') {
            // Already fixed above
            return;
        }
        
        const buttonSection = content.indexOf(`${button.id}.textContent =`, encounterSection);
        
        if (buttonSection !== -1) {
            // Extract the current line
            const lineEnd = content.indexOf(';', buttonSection) + 1;
            const currentLine = content.substring(buttonSection, lineEnd);
            
            // Check if it has the correct text
            if (!currentLine.includes(button.text)) {
                // Replace with correct text
                const correctLine = `${button.id}.textContent = '${button.text}'`;
                content = content.substring(0, buttonSection) + correctLine + content.substring(lineEnd);
                modified = true;
                console.log(`Fixed ${button.id} text`);
            }
        }
        
        // Also check and fix the button color if needed
        const styleSection = content.indexOf(`Object.assign(${button.id}.style,`, encounterSection);
        
        if (styleSection !== -1) {
            // Find the backgroundColor line
            const backgroundColorStart = content.indexOf('backgroundColor:', styleSection);
            
            if (backgroundColorStart !== -1) {
                // Find the end of the backgroundColor property
                const backgroundColorEnd = content.indexOf(',', backgroundColorStart);
                if (backgroundColorEnd !== -1) {
                    const currentColor = content.substring(backgroundColorStart, backgroundColorEnd);
                    
                    // Check if it has the correct color
                    if (!currentColor.includes(button.color)) {
                        // Replace with correct color
                        const correctColor = `backgroundColor: '${button.color}'`;
                        content = content.substring(0, backgroundColorStart) + correctColor + content.substring(backgroundColorEnd);
                        modified = true;
                        console.log(`Fixed ${button.id} color`);
                    }
                }
            }
        }
    });
    
    // Fix crowbarOption color if needed
    const crowbarStyleSection = content.indexOf('Object.assign(crowbarOption.style,', encounterSection);
    
    if (crowbarStyleSection !== -1) {
        // Find the backgroundColor line
        const backgroundColorStart = content.indexOf('backgroundColor:', crowbarStyleSection);
        
        if (backgroundColorStart !== -1) {
            // Find the end of the backgroundColor property
            const backgroundColorEnd = content.indexOf(',', backgroundColorStart);
            if (backgroundColorEnd !== -1) {
                const currentColor = content.substring(backgroundColorStart, backgroundColorEnd);
                
                // Check if it has the correct color
                if (!currentColor.includes(correctButtons[2].color)) {
                    // Replace with correct color
                    const correctColor = `backgroundColor: '${correctButtons[2].color}'`;
                    content = content.substring(0, backgroundColorStart) + correctColor + content.substring(backgroundColorEnd);
                    modified = true;
                    console.log('Fixed crowbarOption color');
                }
            }
        }
    }
    
    if (modified) {
        // Write changes back to the file
        fs.writeFileSync(filePath, content);
        console.log('Successfully updated button text and colors on the stealth page!');
    } else {
        console.log('No changes needed - button text and colors are already correct.');
    }
    
} catch (error) {
    console.error('Error fixing buttons:', error);
} 