const fs = require('fs');

try {
    // Read the disguise.html file
    const filePath = 'disguise.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix the description - it should be unique, not the default checkpoint description
    const descPattern = /description\.innerHTML = ['"]You've reached the city limits[^'"]*['"];/;
    if (descPattern.test(content)) {
        content = content.replace(
            descPattern,
            `description.innerHTML = 'You\\'ve chosen to use a worker disguise to get through the checkpoint. The forged worker ID in your pocket feels like a ticking time bomb, but it\\'s your best chance at passing inspection. Remember to act natural when approaching the guards - your success depends on looking the part of an ordinary factory worker.';`
        );
    }
    
    // 2. Find all button declarations to check for duplicates
    const borderEncounterFunction = content.indexOf('function triggerBorderEncounter()');
    if (borderEncounterFunction === -1) {
        throw new Error('Could not find the triggerBorderEncounter function');
    }
    
    // Find the main option (first button)
    const disguiseOptionDec = content.indexOf('disguiseOption.textContent', borderEncounterFunction);
    if (disguiseOptionDec !== -1) {
        // Check if it exists - if not, we need to add proper button text
        if (disguiseOptionDec === -1) {
            // We need to fix by adding the main button option
            const buttonDecLine = content.indexOf('const disguiseOption = document.createElement(\'button\');', borderEncounterFunction);
            if (buttonDecLine !== -1) {
                const insertPos = content.indexOf(';', buttonDecLine) + 1;
                content = content.substring(0, insertPos) + 
                          "\ndisguiseOption.textContent = 'Bluff through checkpoint with forged papers';" +
                          content.substring(insertPos);
            }
        }
    }
    
    // Check duplicate buttons - fix if the same option appears twice
    let buttonOptions = [
        {
            searchText: 'Befriend a guard for inside help',
            correctFirst: 'Create a distraction with staged accident',
            correctSecond: 'Befriend a guard for inside help',
            colorFirst: '#997755',
            colorSecond: '#557799'
        }
    ];
    
    // Search for duplicate buttons and fix them
    buttonOptions.forEach(option => {
        // Find all instances of this button text
        const pattern = new RegExp(`\\.textContent = ['"]${option.searchText}['"];`, 'g');
        const matches = [...content.matchAll(pattern)];
        
        if (matches.length > 1) {
            // Fix the first occurrence
            const firstMatch = matches[0][0];
            const firstReplacement = firstMatch.replace(option.searchText, option.correctFirst);
            content = content.replace(firstMatch, firstReplacement);
            
            // No need to fix the second occurrence if it's correct
            // Change its color if needed
            const colorPatterns = [
                {
                    buttonName: 'sneakOption',
                    search: /sneakOption\.addEventListener\('click'/,
                    colorSearch: /backgroundColor: ['"]#[0-9a-f]{6}['"]/,
                    color: option.colorFirst
                },
                {
                    buttonName: 'alternativeOption',
                    search: /alternativeOption\.addEventListener\('click'/,
                    colorSearch: /backgroundColor: ['"]#[0-9a-f]{6}['"]/,
                    color: option.colorSecond
                }
            ];
            
            // Update button colors
            colorPatterns.forEach(pattern => {
                const buttonSection = content.indexOf(pattern.search);
                if (buttonSection !== -1) {
                    const stylesStart = content.lastIndexOf('Object.assign', buttonSection);
                    if (stylesStart !== -1) {
                        const stylesEnd = content.indexOf('});', stylesStart) + 3;
                        const stylesSection = content.substring(stylesStart, stylesEnd);
                        
                        if (pattern.colorSearch.test(stylesSection)) {
                            const newStylesSection = stylesSection.replace(
                                pattern.colorSearch,
                                `backgroundColor: '${pattern.color}'`
                            );
                            content = content.replace(stylesSection, newStylesSection);
                        }
                    }
                }
            });
        }
    });
    
    // Write the corrected content back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully fixed disguise page event description and duplicate options!');
    
} catch (error) {
    console.error('Error fixing disguise page:', error);
} 