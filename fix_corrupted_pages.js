const fs = require('fs');

// List of problematic files
const files = ['disguise.html', 'alternative.html', 'sneak.html'];

for (const file of files) {
    console.log(`Fixing ${file}...`);
    
    try {
        // Read the corrupted file
        let content = fs.readFileSync(file, 'utf8');
        
        // First, make a backup
        fs.writeFileSync(`${file}.backup4`, content);
        
        // Fix corrupted startIntroCutscene function
        content = content.replace(/function startIntroCutscene\(\) \{[\s\S]*?cutsceneActive = true;[\s\S]*?return; \/\/ Disabled for direct gameplay\n}/m, 
`function startIntroCutscene() {
    // Skip cutscene if player is continuing from a save and not at spawn position
    if (savedPosition && 
        (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
        console.log("Player continuing from save - skipping intro cutscene");
        return; // Skip the cutscene entirely
    }
    
    cutsceneActive = true;
    return; // Disabled for direct gameplay
}`);

        // Fix corrupted advanceCutscene function
        content = content.replace(/function advanceCutscene\(\) \{[\s\S]*?return; \/\/ Disabled for direct gameplay\n}/m,
`function advanceCutscene() {
    return; // Disabled for direct gameplay
}`);

        // Fix corrupted skipCutscene function
        content = content.replace(/function skipCutscene\(\) \{[\s\S]*?return; \/\/ Disabled for direct gameplay\n}/m,
`function skipCutscene() {
    return; // Disabled for direct gameplay
}`);

        // Fix corrupted checkStoryProgress function
        content = content.replace(/function checkStoryProgress\(position\) \{[\s\S]*?const borderCheckpoint = \{[\s\S]*?x: 0,[\s\S]*?z: [0-9]+,[\s\S]*?radius: 5/m,
`function checkStoryProgress(position) {
    // Skip triggers if player loaded from a save and is already away from spawn
    if (savedPosition && 
        (Math.abs(position.x) > 5 || Math.abs(position.z) > 5)) {
        gameProgress.borderReached = true; // Prevent border trigger
        console.log("Player continuing from save - skipping story triggers");
        return;
    }
    
    // Only check for progress if we're in a phase where events can trigger
    if (gameProgress.storyPhase !== 'escape' || gameProgress.borderReached) {
        return;
    }
    
    // Border checkpoint location - use simple distance calculation to improve performance
    const borderCheckpoint = {
        x: 0,    // Center x-coordinate
        z: 110,   // Changed from 120 to trigger event earlier
        radius: 5`);

        // Fix corrupted triggerBorderEncounter function
        content = content.replace(/function triggerBorderEncounter\(\) \{[\s\S]*?if \(gameProgress\.eventInProgress\) return;/m,
`function triggerBorderEncounter() {
    // Skip for continued games
    if (savedPosition && 
        (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
        console.log("Player continuing from save - skipping border encounter");
        return;
    }
    
    // Prevent multiple trigger
    if (gameProgress.eventInProgress) return;`);

        // Remove all "if (window.savedGameProgress &&..." lines inside functions
        content = content.replace(/\s+\/\/ Skip cutscene if player has already seen it and is continuing from a save\s+if \(window\.savedGameProgress.+?\{[\s\S]*?return;\s+\}/g, '');
        
        // Save the fixed file
        fs.writeFileSync(file, content);
        console.log(`  Successfully fixed ${file}`);
        
    } catch (error) {
        console.error(`  Error fixing ${file}:`, error.message);
    }
}

console.log('\nAll files fixed!'); 