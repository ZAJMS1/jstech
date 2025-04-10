const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

// The working checkpoint functions
const borderCheckpointCode = `
                // Check game story progress based on player position
                function checkStoryProgress(position) {
                    // Only check for progress if we're in a phase where events can trigger
                    if (gameProgress.storyPhase !== 'escape' || gameProgress.borderReached) {
                        return;
                    }
                    
                    // Border checkpoint location - use simple distance calculation to improve performance
                    const borderCheckpoint = {
                        x: 0,    // Center x-coordinate
                        z: 80,   // Changed from 120 to trigger event earlier
                        radius: 5 // Detection radius
                    };
                    
                    // Use squared distance for better performance (avoid expensive sqrt)
                    const dx = position.x - borderCheckpoint.x;
                    const dz = position.z - borderCheckpoint.z;
                    const squaredDist = dx*dx + dz*dz;
                    const squaredRadius = borderCheckpoint.radius * borderCheckpoint.radius;
                    
                    // If player is at the border checkpoint and it hasn't been triggered yet
                    if (squaredDist < squaredRadius && !gameProgress.eventInProgress && !document.getElementById("border-encounter")) {
                        console.log("Border checkpoint reached!");
                        
                        // Set flags to prevent retriggering
                        gameProgress.borderReached = true;
                        gameProgress.storyPhase = 'border';
                        
                        // Trigger UI immediately to avoid lag
                        triggerBorderEncounter();
                        
                        // Pause movement for the event
                        cutsceneActive = true;
                    }
                }
                
                // Trigger a story event at the border
                function triggerBorderEncounter() {
                    // Prevent multiple trigger
                    if (gameProgress.eventInProgress) return;
                    gameProgress.eventInProgress = true;

                    // Disable player controls during the event
                    blocker.style.display = 'none';
                    
                    // Create border checkpoint UI - optimize for better performance
                    const encounterContainer = document.createElement('div');
                    encounterContainer.id = 'border-encounter';
                    
                    // Set styles with minimal reflows
                    Object.assign(encounterContainer.style, {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '70%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        zIndex: '1000',
                        opacity: '0',
                        transition: 'opacity 0.3s ease-in'
                    });
                    
                    // Prepare content first, then add to DOM once
                    const content = document.createDocumentFragment();
                    
                    // Add title
                    const title = document.createElement('h2');
                    title.textContent = 'Border Checkpoint';
                    title.style.marginBottom = '20px';
                    content.appendChild(title);
                    
                    // Add description
                    const description = document.createElement('p');
                    description.innerHTML = 'You\\'ve reached the city limits. Ahead, you see the heavily guarded border checkpoint.<br><br>Armed guards patrol the perimeter, and surveillance drones hover overhead. Getting past this won\\'t be easy.';
                    description.style.marginBottom = '30px';
                    description.style.lineHeight = '1.5';
                    content.appendChild(description);
                    
                    // Create options based on inventory
                    const optionsContainer = document.createElement('div');
                    Object.assign(optionsContainer.style, {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    });
                    
                    // Option 1: Try to sneak past
                    const sneakOption = document.createElement('button');
                    sneakOption.textContent = 'Try to sneak past the guards';
                    Object.assign(sneakOption.style, {
                        padding: '15px 20px',
                        backgroundColor: '#446688',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    });
                    sneakOption.addEventListener('click', function() {
                        // Redirect to sneak page
                        window.location.href = '/sneak';
                    });
                    optionsContainer.appendChild(sneakOption);
                    
                    // Option 2: Look for alternative route
                    const alternativeOption = document.createElement('button');
                    alternativeOption.textContent = 'Search for an alternative route';
                    Object.assign(alternativeOption.style, {
                        padding: '15px 20px',
                        backgroundColor: '#557755',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    });
                    alternativeOption.addEventListener('click', function() {
                        // Redirect to alternative route page
                        window.location.href = '/alternative';
                    });
                    optionsContainer.appendChild(alternativeOption);
                    
                    // Option 3: Show crowbar option if available
                    if (gameProgress.hasBackpack && window.playerInventory && window.playerInventory.hasItem('Crowbar')) {
                        const crowbarOption = document.createElement('button');
                        crowbarOption.textContent = 'Use crowbar to break into the sewers';
                        Object.assign(crowbarOption.style, {
                            padding: '15px 20px',
                            backgroundColor: '#775555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        });
                        crowbarOption.addEventListener('click', function() {
                            // Redirect to disguise page
                            window.location.href = '/disguise';
                        });
                        optionsContainer.appendChild(crowbarOption);
                    }
                    
                    // Add options to content
                    content.appendChild(optionsContainer);
                    
                    // Add all content at once to minimize layout thrashing
                    encounterContainer.appendChild(content);
                    document.body.appendChild(encounterContainer);
                    
                    // Force a reflow and then fade in - smoother transition
                    setTimeout(() => {
                        encounterContainer.style.opacity = '1';
                    }, 10);
                }`;

files.forEach(file => {
  try {
    console.log(`Fixing border checkpoint in ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // First fix: Make sure checkStoryProgress is actually called from animate function
    const animateUpdatePattern = /update\(time, delta\);(\s+)\/\/ Check story progress based on player position(\s+)checkStoryProgress\(player\.position\);/;
    if (!content.match(animateUpdatePattern)) {
      console.log(`Adding checkStoryProgress call to animate function in ${file}`);
      
      const animateFunctionPattern = /function animate\(time\)[\s\S]*?update\(time, delta\);/;
      if (content.match(animateFunctionPattern)) {
        content = content.replace(
          animateFunctionPattern,
          (match) => match + '\n                    // Check story progress based on player position\n                    checkStoryProgress(player.position);'
        );
      }
    }
    
    // Second fix: Replace the disabled functions with working ones
    const disabledFunctionsPattern = /function checkStoryProgress\(position\) \{\s+\/\/ Disabled - do nothing\s+return;\s+\}[\s\S]*?function triggerBorderEncounter\(\) \{\s+\/\/ Disabled - do nothing\s+return;\s+\}/;
    
    if (content.match(disabledFunctionsPattern)) {
      console.log(`Replacing disabled border checkpoint functions in ${file}`);
      content = content.replace(disabledFunctionsPattern, borderCheckpointCode);
    }
    
    // Third fix: Add gameProgress.eventInProgress property if missing
    if (!content.includes('eventInProgress')) {
      const gameProgressPattern = /let gameProgress = \{[\s\S]*?borderReached: false/;
      if (content.match(gameProgressPattern)) {
        content = content.replace(
          gameProgressPattern,
          (match) => match + ',\n                    eventInProgress: false'
        );
      }
    }
    
    // Write the fixed content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Finished fixing border checkpoint functionality in all files.'); 