const fs = require('fs');
const path = require('path');

// Get all HTML files (except index.html and success.html)
const files = fs.readdirSync('.').filter(file => 
    file.endsWith('.html') && 
    file !== 'index.html' && 
    file !== 'success.html'
);

let updatedFiles = 0;

for (const file of files) {
    console.log(`Processing ${file}...`);
    
    // Skip backup files
    if (file.includes('.backup') || file.includes('.bak') || 
        file.includes('.old') || file.includes('.tmp')) {
        console.log(`  Skipping backup file ${file}`);
        continue;
    }
    
    try {
        // Read file content
        let fileContent = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 1. Add skip logic to startIntroCutscene 
        const startIntroCutsceneRegex = /function startIntroCutscene\(\) \{/;
        if (startIntroCutsceneRegex.test(fileContent)) {
            const skipCutsceneCode = `function startIntroCutscene() {
    // Skip cutscene if player is continuing from a save and not at spawn position
    if (savedPosition && 
        (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
        console.log("Player continuing from save - skipping intro cutscene");
        return; // Skip the cutscene entirely
    }
    
    cutsceneActive = true;`;

            fileContent = fileContent.replace(startIntroCutsceneRegex, skipCutsceneCode);
            modified = true;
            console.log(`  Updated startIntroCutscene in ${file}`);
        }
        
        // 2. Add skip logic to checkStoryProgress
        const checkStoryProgressRegex = /function checkStoryProgress\(position\) \{/;
        if (checkStoryProgressRegex.test(fileContent)) {
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
            modified = true;
            console.log(`  Updated checkStoryProgress in ${file}`);
        }
        
        // 3. Add skip logic to triggerBorderEncounter
        const triggerBorderEncounterRegex = /function triggerBorderEncounter\(\) \{/;
        if (triggerBorderEncounterRegex.test(fileContent)) {
            const skipBorderEncounterCode = `function triggerBorderEncounter() {
    // Skip for continued games
    if (savedPosition && 
        (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
        console.log("Player continuing from save - skipping border encounter");
        return;
    }
    
    // Prevent multiple trigger`;

            fileContent = fileContent.replace(triggerBorderEncounterRegex, skipBorderEncounterCode);
            modified = true;
            console.log(`  Updated triggerBorderEncounter in ${file}`);
        }
        
        // 4. Add skip logic for the knife popup (specific to alternative.html and fence.html)
        const knifePopupRegex = /Show the popup after a 2 second delay/;
        if (knifePopupRegex.test(fileContent)) {
            const knifeShowPopupRegex = /setTimeout\(\(\) => \{[\s\S]*?directKnifePopup\.style\.display = ['"]block['"];/;
            if (knifeShowPopupRegex.test(fileContent)) {
                const skipKnifePopupCode = `setTimeout(() => {
        // Skip knife popup if continuing from save
        if (savedPosition && 
            (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {
            console.log("Player continuing from save - skipping knife popup");
            return;
        }
        directKnifePopup.style.display = "block";`;
                
                fileContent = fileContent.replace(knifeShowPopupRegex, skipKnifePopupCode);
                modified = true;
                console.log(`  Updated knife popup in ${file}`);
            }
        }
        
        // Save the file if modified
        if (modified) {
            fs.writeFileSync(file, fileContent);
            updatedFiles++;
            console.log(`  Successfully updated ${file}`);
        } else {
            console.log(`  No updates needed for ${file}`);
        }
    } catch (error) {
        console.error(`  Error processing ${file}:`, error.message);
    }
}

console.log(`\nCompleted! Updated ${updatedFiles} out of ${files.length} files.`); 