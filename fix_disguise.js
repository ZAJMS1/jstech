const fs = require('fs');

// Read the disguise.html file
try {
    const filePath = 'disguise.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Ensure cutsceneActive is always false
    const cutsceneVarPattern = /(let cutsceneActive = ).*?;/;
    content = content.replace(cutsceneVarPattern, '$1false; // Permanently disabled');
    
    // Disable cutscene functions by making them return immediately
    const cutsceneFunctions = [
        'startIntroCutscene',
        'advanceCutscene',
        'skipCutscene',
        'playIntroduction',
        'showDialogue'
    ];
    
    cutsceneFunctions.forEach(funcName => {
        const funcPattern = new RegExp(`function ${funcName}\\([^)]*\\)\\s*\\{[\\s\\S]*?\\}`, 'g');
        content = content.replace(funcPattern, function(match) {
            return `function ${funcName}() {\n    return; // Disabled for direct gameplay\n}`;
        });
    });
    
    // Remove any code that sets cutsceneActive to true
    const enableCutscenePattern = /cutsceneActive\s*=\s*true;/g;
    content = content.replace(enableCutscenePattern, '// cutsceneActive = false; // Kept disabled');
    
    // Only change to the triggerBorderEncounter function's cutscene activation
    // We still want the border encounter to work, but without activating cutscene mode
    const borderEncounterPattern = /(function triggerBorderEncounter\(\) \{[\s\S]*?cutsceneActive = true;)/g;
    content = content.replace(borderEncounterPattern, (match) => {
        return match.replace('cutsceneActive = true;', '// cutsceneActive remains false to maintain player control');
    });
    
    // Ensure controls are unlocked from the start
    const initPattern = /(document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?)(?=\/\/ Position player)/;
    if (initPattern.test(content)) {
        content = content.replace(initPattern, 
            '$1\n    // Ensure controls are unlocked from the start\n    blocker.style.display = "flex";\n    instructions.style.display = "";\n    \n    ');
    }
    
    // Set gameProgress to skip intro and go straight to escape phase
    const gameProgressPattern = /(const gameProgress = \{[\s\S]*?)storyPhase:.*?,/g;
    content = content.replace(gameProgressPattern, '$1storyPhase: "escape", // Start directly in escape phase');
    
    // Set hasBackpack to true for the disguise route
    const backpackPattern = /(const gameProgress = \{[\s\S]*?)hasBackpack:.*?,/g;
    content = content.replace(backpackPattern, '$1hasBackpack: true, // Player has backpack for disguise route');
    
    // Add a custom message about disguise path
    const messagePattern = /\/\/ Position player/;
    content = content.replace(messagePattern, '// Display disguise path message\n    displayMessage("You\'ve acquired a worker disguise. Try to blend in at the checkpoint.", 5000);\n\n    // Position player');
    
    // Write the modified content back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully removed cutscene functionality from disguise.html while maintaining player control!');
    
} catch (error) {
    console.error('Error modifying disguise.html:', error);
} 