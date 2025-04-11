const fs = require('fs');

try {
    const filePath = 'disguise.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the border encounter section
    const borderSection = content.indexOf('function triggerBorderEncounter()');
    if (borderSection === -1) {
        throw new Error('Could not find border encounter function');
    }
    
    // Define the correct buttons and their colors
    const correctButtons = [
        {
            id: 'disguiseOption',
            text: 'Bluff through checkpoint with forged papers',
            color: '#775599'
        },
        {
            id: 'sneakOption',
            text: 'Create a distraction with staged accident',
            color: '#997755'
        },
        {
            id: 'alternativeOption',
            text: 'Befriend a guard for inside help',
            color: '#557799'
        }
    ];
    
    let modified = false;
    
    // Check for each button and fix its text and color
    correctButtons.forEach(button => {
        // Find the button creation
        const buttonDeclaration = content.indexOf(`const ${button.id} = document.createElement('button');`, borderSection);
        
        if (buttonDeclaration !== -1) {
            // Find if there's a textContent setter for this button
            const textContentStart = content.indexOf(`${button.id}.textContent =`, buttonDeclaration);
            
            if (textContentStart !== -1) {
                // Find the end of this line to replace the whole statement
                const textContentEnd = content.indexOf(';', textContentStart) + 1;
                const currentLine = content.substring(textContentStart, textContentEnd);
                
                // Create the replacement with appropriate quotes
                const useDoubleQuotes = currentLine.includes('"');
                const quoteChar = useDoubleQuotes ? '"' : "'";
                const correctLine = `${button.id}.textContent = ${quoteChar}${button.text}${quoteChar};`;
                
                // Replace if different
                if (currentLine !== correctLine) {
                    content = content.substring(0, textContentStart) + correctLine + content.substring(textContentEnd);
                    modified = true;
                }
            } else {
                // If no textContent setter found, add it after the button declaration
                const insertPoint = content.indexOf(';', buttonDeclaration) + 1;
                content = content.substring(0, insertPoint) + 
                          `\n    ${button.id}.textContent = '${button.text}';` + 
                          content.substring(insertPoint);
                modified = true;
            }
            
            // Now fix the color in the Object.assign
            const assignStart = content.indexOf(`Object.assign(${button.id}.style`, buttonDeclaration);
            
            if (assignStart !== -1) {
                // Find the backgroundColor line in this section
                const assignEnd = content.indexOf('});', assignStart) + 3;
                const styleSection = content.substring(assignStart, assignEnd);
                
                const colorPattern = /backgroundColor: ['"]#[0-9a-f]{6}['"]/i;
                const colorMatch = styleSection.match(colorPattern);
                
                if (colorMatch) {
                    // Replace color if different
                    const correctColor = `backgroundColor: '${button.color}'`;
                    if (!styleSection.includes(correctColor)) {
                        const newStyleSection = styleSection.replace(colorPattern, correctColor);
                        content = content.substring(0, assignStart) + newStyleSection + content.substring(assignEnd);
                        modified = true;
                    }
                }
            }
        }
    });
    
    // Also check for any duplicate buttons with the same text
    correctButtons.forEach(button => {
        const textPattern = new RegExp(`\\.textContent = ['"]${button.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}['"];`, 'g');
        const matches = [...content.matchAll(textPattern)];
        
        // If this text appears more than once, fix duplicates
        if (matches.length > 1) {
            // Keep the first occurrence that matches the correct button ID
            const correctMatch = matches.find(match => {
                const lineStart = content.lastIndexOf('\n', match.index) + 1;
                const line = content.substring(lineStart, match.index + match[0].length);
                return line.includes(button.id);
            });
            
            if (correctMatch) {
                matches.forEach(match => {
                    if (match.index !== correctMatch.index) {
                        // This is a duplicate we need to replace
                        const lineStart = content.lastIndexOf('\n', match.index) + 1;
                        const lineEnd = content.indexOf(';', match.index) + 1;
                        const currentLine = content.substring(lineStart, lineEnd);
                        
                        // Determine which button this is
                        let buttonId = '';
                        correctButtons.forEach(b => {
                            if (b.id !== button.id && currentLine.includes(b.id)) {
                                buttonId = b.id;
                            }
                        });
                        
                        if (buttonId) {
                            // Find the correct text for this button
                            const correctButtonText = correctButtons.find(b => b.id === buttonId).text;
                            const useDoubleQuotes = currentLine.includes('"');
                            const quoteChar = useDoubleQuotes ? '"' : "'";
                            const correctLine = `${buttonId}.textContent = ${quoteChar}${correctButtonText}${quoteChar};`;
                            
                            content = content.substring(0, lineStart) + correctLine + content.substring(lineEnd);
                            modified = true;
                        }
                    }
                });
            }
        }
    });
    
    if (modified) {
        // Write changes back to the file
        fs.writeFileSync(filePath, content);
        console.log('Successfully updated button text and colors on the disguise page!');
    } else {
        console.log('No changes needed - button text and colors are already correct.');
    }
    
} catch (error) {
    console.error('Error fixing buttons:', error);
} 