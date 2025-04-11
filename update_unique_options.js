const fs = require('fs');

// Define unique options for each page
const pageOptions = {
    'disguise.html': {
        mainOption: {
            text: 'Bluff through checkpoint with forged papers',
            color: '#775599'
        },
        secondOption: {
            text: 'Create a distraction with staged accident',
            color: '#997755'
        },
        thirdOption: {
            text: 'Befriend a guard for inside help',
            color: '#557799'
        }
    },
    'sneak.html': {
        mainOption: {
            text: 'Use darkness and shadows to slip past',
            color: '#445577'
        },
        secondOption: {
            text: 'Steal guard uniforms to blend in',  // Already updated, kept as is
            color: '#557755'
        },
        thirdOption: {
            text: 'Sabotage cameras to create blind spots',
            color: '#997755'
        }
    },
    'alternative.html': {
        mainOption: {
            text: 'Explore abandoned maintenance tunnels',
            color: '#558855'
        },
        secondOption: {
            text: 'Ride supply truck through delivery entrance',
            color: '#885577'
        },
        thirdOption: {
            text: 'Cut through fence at unguarded section',
            color: '#778855'
        }
    }
};

// Function to update options in a file
function updateFileOptions(filePath, options) {
    try {
        console.log(`Updating options in ${filePath}...`);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the triggerBorderEncounter function
        const functionStart = content.indexOf('function triggerBorderEncounter()');
        if (functionStart === -1) {
            console.log(`Could not find triggerBorderEncounter function in ${filePath}`);
            return false;
        }
        
        // Check which button patterns exist in this file
        const buttonTypes = [
            {
                name: 'sneakOption',
                pattern: /sneakOption\.textContent = ['"][^'"]*['"];/g,
                newText: filePath === 'sneak.html' ? 
                    options.mainOption.text : 
                    (filePath === 'disguise.html' ? options.secondOption.text : options.secondOption.text)
            },
            {
                name: 'alternativeOption',
                pattern: /alternativeOption\.textContent = ['"][^'"]*['"];/g,
                newText: filePath === 'alternative.html' ? 
                    options.mainOption.text : 
                    (filePath === 'disguise.html' ? options.thirdOption.text : options.thirdOption.text)
            },
            {
                name: 'disguiseOption',
                pattern: /disguiseOption\.textContent = ['"][^'"]*['"];/g,
                newText: filePath === 'disguise.html' ? 
                    options.mainOption.text : 
                    options.secondOption.text
            },
            {
                name: 'crowbarOption',
                pattern: /crowbarOption\.textContent = ['"][^'"]*['"];/g,
                newText: filePath === 'sneak.html' ? 
                    options.thirdOption.text : 
                    (filePath === 'disguise.html' ? options.thirdOption.text : options.thirdOption.text)
            }
        ];
        
        // Update button text for each type
        buttonTypes.forEach(button => {
            // Find matches for this button type
            const matches = content.match(button.pattern);
            if (matches && matches.length > 0) {
                // Replace each match with new text
                matches.forEach(match => {
                    // Create replacement with correct quotes
                    const quoteChar = match.includes('"') ? '"' : "'";
                    const replacement = `${button.name}.textContent = ${quoteChar}${button.newText}${quoteChar};`;
                    content = content.replace(match, replacement);
                });
                
                // Also update button colors where possible
                const buttonColor = filePath === 'disguise.html' ? 
                    (button.name === 'disguiseOption' ? options.mainOption.color : 
                     button.name === 'sneakOption' ? options.secondOption.color : options.thirdOption.color) :
                    (filePath === 'sneak.html' ? 
                     (button.name === 'sneakOption' ? options.mainOption.color : 
                      button.name === 'alternativeOption' ? options.secondOption.color : options.thirdOption.color) :
                     (button.name === 'alternativeOption' ? options.mainOption.color : 
                      button.name === 'sneakOption' ? options.secondOption.color : options.thirdOption.color));
                
                // Only replace color if found - be careful with this
                const colorPattern = new RegExp(`backgroundColor: ['"]#[0-9a-f]{6}['"]`, 'i');
                const buttonSection = content.indexOf(`${button.name}.addEventListener`);
                
                if (buttonSection !== -1) {
                    const sectionStart = content.lastIndexOf('Object.assign', buttonSection);
                    if (sectionStart !== -1) {
                        const sectionEnd = content.indexOf('});', sectionStart) + 3;
                        const buttonStyleSection = content.substring(sectionStart, sectionEnd);
                        
                        if (colorPattern.test(buttonStyleSection)) {
                            const newButtonStyleSection = buttonStyleSection.replace(
                                colorPattern, 
                                `backgroundColor: '${buttonColor}'`
                            );
                            content = content.replace(buttonStyleSection, newButtonStyleSection);
                        }
                    }
                }
            }
        });
        
        // Write updated content back to file
        fs.writeFileSync(filePath, content);
        console.log(`Successfully updated options in ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
        return false;
    }
}

// Update options in all three files
const files = ['disguise.html', 'sneak.html', 'alternative.html'];
let successCount = 0;

files.forEach(file => {
    if (updateFileOptions(file, pageOptions[file])) {
        successCount++;
    }
});

console.log(`Successfully updated options in ${successCount} out of ${files.length} files.`); 