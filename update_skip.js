const fs = require('fs');

// Read game.html
let fileContent = fs.readFileSync('game.html', 'utf8');

// 1. Add skip logic to startIntroCutscene 
const startIntroCutsceneRegex = /function startIntroCutscene\(\) \{/;
const skipCutsceneCode = `function startIntroCutscene() {
    // Skip cutscene if player is continuing from a save and not at spawn position
    if (savedPosition && 
        (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
        console.log("Player continuing from save - skipping intro cutscene");
        return; // Skip the cutscene entirely
    }
    
    cutsceneActive = true;`;

fileContent = fileContent.replace(startIntroCutsceneRegex, skipCutsceneCode);

// 2. Add skip logic to checkStoryProgress
const checkStoryProgressRegex = /function checkStoryProgress\(position\) \{/;
const skipStoryProgressCode = `function checkStoryProgress(position) {
    // Skip triggers if player loaded from a save and is already away from spawn
    if (savedPosition && 
        (Math.abs(position.x) > 5 || Math.abs(position.z) > 5)) {
        gameProgress.borderReached = true; // Prevent border trigger
        console.log("Player continuing from save - skipping story triggers");
        return;
    }
    
    // Only check for progress if we're in a phase where events can trigger`;

fileContent = fileContent.replace(checkStoryProgressRegex, skipStoryProgressCode);

// 3. Add skip logic to triggerBorderEncounter
const triggerBorderEncounterRegex = /function triggerBorderEncounter\(\) \{/;
const skipBorderEncounterCode = `function triggerBorderEncounter() {
    // Skip for continued games
    if (savedPosition && 
        (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
        console.log("Player continuing from save - skipping border encounter");
        return;
    }
    
    // Prevent multiple trigger`;

fileContent = fileContent.replace(triggerBorderEncounterRegex, skipBorderEncounterCode);

// Write back the updated file
fs.writeFileSync('game.html', fileContent);
console.log('Successfully updated game.html with skip functionality'); 