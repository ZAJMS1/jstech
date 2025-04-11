const fs = require('fs');
const path = require('path');

// Define the outcome pages we need to create
const outcomes = [
  {
    sourcePath: 'disguise.html',
    destinations: [
      {
        name: 'checkpoint.html',
        title: 'Checkpoint Disguise',
        description: 'You approach the checkpoint in disguise, hoping your forged papers will get you through.',
        options: [
          {
            text: 'Show your papers confidently',
            success: 0.7,
            successOutcome: 'With steady hands, you present your forged papers. The guard barely glances at them before waving you through.',
            failureOutcome: 'The guard studies your papers too carefully, noticing inconsistencies. "These don\'t look right. Step aside for further questioning."',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Create a distraction then slip through',
            success: 0.5,
            successOutcome: 'You cause a commotion by "accidentally" knocking over equipment. In the chaos, you slip through the checkpoint unnoticed.',
            failureOutcome: 'Your attempt at distraction draws too much attention. Guards immediately surround you, weapons raised.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Blend with a group of workers',
            success: 0.6,
            successOutcome: 'You casually join a group of tired workers returning from their shift. The guards process you all as a group, not looking closely at individuals.',
            failureOutcome: 'One of the workers notices you don\'t belong and alerts a guard. "This one\'s not with us," they say.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      },
      {
        name: 'accident.html',
        title: 'Staged Accident',
        description: 'You\'ve prepared a diversion to draw attention away from the checkpoint.',
        options: [
          {
            text: 'Cause electrical malfunction',
            success: 0.6,
            successOutcome: 'The lights flicker and die across the checkpoint. In the darkness and confusion, you slip past the disoriented guards.',
            failureOutcome: 'The backup generators kick in almost immediately. Guards become extra vigilant, and you\'re caught trying to take advantage of the brief darkness.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Start a small fire in a trash can',
            success: 0.4,
            successOutcome: 'The fire creates the perfect distraction as guards rush to contain it. You casually walk through the unattended checkpoint.',
            failureOutcome: 'The fire spreads too quickly, triggering alarms everywhere. The entire complex goes into lockdown with you caught inside.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Fake a medical emergency',
            success: 0.7,
            successOutcome: 'You convincingly collapse to the ground, gasping for air. While medical personnel rush to help, you "recover" and slip away in the confusion.',
            failureOutcome: 'The medical staff quickly realize you\'re faking. Security is immediately alerted to the deception.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      },
      {
        name: 'guard.html',
        title: 'Guard Interaction',
        description: 'You\'ve established contact with a sympathetic guard who might help you escape.',
        options: [
          {
            text: 'Ask for direct help crossing the checkpoint',
            success: 0.3,
            successOutcome: 'The guard escorts you through the checkpoint as if you\'re being transferred, then discretely lets you go once you\'re clear.',
            failureOutcome: 'Your "ally" was setting a trap. You\'re immediately surrounded by guards who were waiting for you.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Request information about patrol schedules',
            success: 0.8,
            successOutcome: 'Armed with precise information about guard rotations, you time your escape perfectly through an unattended section.',
            failureOutcome: 'The information was deliberately wrong. You walk straight into a heavily guarded area.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Bribe for access to service tunnels',
            success: 0.5,
            successOutcome: 'The guard accepts your bribe and gives you a key card to access the maintenance tunnels that bypass the main checkpoint.',
            failureOutcome: 'The guard takes your bribe but immediately reports you. "Attempting to bribe an officer is a serious offense," they announce as more guards arrive.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      }
    ]
  },
  {
    sourcePath: 'sneak.html',
    destinations: [
      {
        name: 'shadows.html',
        title: 'Through the Shadows',
        description: 'Using the darkness as cover, you move carefully between guard posts and security cameras.',
        options: [
          {
            text: 'Take the long route through completely dark areas',
            success: 0.8,
            successOutcome: 'Patiently moving through the darkest sections, you avoid all detection despite the longer journey time.',
            failureOutcome: 'You lose your bearings in the pitch black and accidentally trigger a motion sensor hidden in the darkness.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Move quickly when guards look away',
            success: 0.5,
            successOutcome: 'With perfect timing, you dash between cover points whenever guards look away, making rapid progress through the checkpoint area.',
            failureOutcome: 'You mistime one of your movements. A guard turns back unexpectedly and spots you mid-dash.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Create shadow distractions',
            success: 0.6,
            successOutcome: 'Using small objects to cast moving shadows elsewhere, you keep guards distracted while you slip by unnoticed.',
            failureOutcome: 'A guard realizes the shadows are a distraction and scans the area more thoroughly, spotting you in your hiding place.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      },
      {
        name: 'uniforms.html',
        title: 'Guard Uniforms',
        description: 'You\'ve managed to acquire a guard uniform from an unattended locker room.',
        options: [
          {
            text: 'Walk confidently like you belong',
            success: 0.7,
            successOutcome: 'With perfect posture and confidence, you walk through checkpoints as guards nod respectfully at your uniform.',
            failureOutcome: 'A senior guard notices you don\'t have the right ID badge for your uniform section. "Hey, you! Stop right there!"',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Join a patrol group',
            success: 0.4,
            successOutcome: 'You seamlessly integrate with a patrol unit heading toward the perimeter, then break away once outside the main compound.',
            failureOutcome: 'The patrol leader checks in with each member. When your turn comes, your lack of knowledge immediately gives you away.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Pretend to escort a prisoner',
            success: 0.5,
            successOutcome: 'You grab a random maintenance worker, pretending they\'re under arrest. Guards at checkpoints let you through without question.',
            failureOutcome: 'The "prisoner" realizes you\'re not a real guard and starts shouting for help. Real guards quickly surround you.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      },
      {
        name: 'cameras.html',
        title: 'Camera Blind Spots',
        description: 'You\'ve identified patterns in the security camera coverage and are ready to exploit the gaps.',
        options: [
          {
            text: 'Use timed movements between camera sweeps',
            success: 0.6,
            successOutcome: 'Carefully counting the seconds between camera movements, you time your progress perfectly through their blind spots.',
            failureOutcome: 'One of the cameras was just replaced with a newer model that moves unpredictably. You walk straight into its view.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Temporarily disable selected cameras',
            success: 0.4,
            successOutcome: 'With careful placement of small devices, you create brief electronic interference in specific cameras, allowing you to pass undetected.',
            failureOutcome: 'The security system detects the camera disruptions and triggers an automatic lockdown, trapping you between checkpoints.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Use reflective material to distort camera views',
            success: 0.7,
            successOutcome: 'Strategically placing small reflective surfaces, you create glare that blinds cameras just long enough to slip past unseen.',
            failureOutcome: 'A security technician notices the unusual glare patterns and investigates, discovering you hiding nearby.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      }
    ]
  },
  {
    sourcePath: 'alternative.html',
    destinations: [
      {
        name: 'tunnels.html',
        title: 'Maintenance Tunnels',
        description: 'The abandoned maintenance tunnels are dark and decaying, but offer a direct path under the border checkpoint.',
        options: [
          {
            text: 'Follow the old maintenance maps',
            success: 0.5,
            successOutcome: 'Despite some collapsed sections forcing detours, the map guides you successfully through the labyrinthine tunnels to the outside.',
            failureOutcome: 'The maps are outdated. You encounter a fully collapsed section with no way around, forcing you to backtrack into a guard patrol.',
            redirect: success => success ? '/success' : '/game',
            requiresItem: 'Pocket Knife'
          },
          {
            text: 'Look for signs of recent passage',
            success: 0.7,
            successOutcome: 'You notice subtle signs that others have passed this way recently. Following these clues leads you to a hidden exit beyond the border.',
            failureOutcome: 'The passage signs lead you straight to a smuggler hideout. They\'re not happy about your unexpected visit and immediately alert the authorities to save themselves.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Use emergency evacuation routes',
            success: 0.6,
            successOutcome: 'The emergency evacuation routes are better maintained and lead directly outside the complex, allowing for a quick escape.',
            failureOutcome: 'Unknown to you, emergency evacuation routes are regularly patrolled. A guard unit on standard patrol spots you immediately.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      },
      {
        name: 'truck.html',
        title: 'Supply Truck',
        description: 'A supply truck is being loaded at the delivery entrance, offering a chance to smuggle yourself out.',
        options: [
          {
            text: 'Hide among the cargo',
            success: 0.6,
            successOutcome: 'Burying yourself deep among crates of supplies, you remain hidden as the truck passes through checkpoints and out of the complex.',
            failureOutcome: 'Random security checks include probing the cargo with detection rods. One passes too close to your hiding spot, triggering an alert.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Create a false manifest entry',
            success: 0.4,
            successOutcome: 'Adding yourself to the digital manifest as "special equipment," guards merely verify the item count matches without looking too closely.',
            failureOutcome: 'The head of security personally verifies the manifest and notices the suspicious late addition. The truck is thoroughly searched.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Bribe the truck driver',
            success: 0.7,
            successOutcome: 'The driver agrees to help for the right price, creating a hidden compartment for you under their seat that passes inspection.',
            failureOutcome: 'The driver takes your bribe but immediately reports you to security to earn an additional reward and avoid punishment.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      },
      {
        name: 'fence.html',
        title: 'Perimeter Fence',
        description: 'You\'ve located a section of fence with minimal security coverage, but it\'s still a dangerous crossing point.',
        options: [
          {
            text: 'Cut through using your pocket knife',
            success: 0.8,
            successOutcome: 'The fence wire yields to your knife, creating an opening just large enough to squeeze through undetected.',
            failureOutcome: 'While cutting, you accidentally trigger a hidden vibration sensor in the fence. Alarms blare as spotlights turn toward your position.',
            redirect: success => success ? '/success' : '/game',
            requiresItem: 'Pocket Knife'
          },
          {
            text: 'Climb over during shift change',
            success: 0.5,
            successOutcome: 'Timing your climb perfectly during guard shift rotation, you make it over the fence while attention is diverted.',
            failureOutcome: 'The new shift arrives early, catching you halfway up the fence with nowhere to hide.',
            redirect: success => success ? '/success' : '/game'
          },
          {
            text: 'Dig under the fence',
            success: 0.6,
            successOutcome: 'The soil near the fence is soft enough to quickly dig a shallow passage underneath, which you cover back up after passing through.',
            failureOutcome: 'While digging, you hit a buried motion sensor cable. Within minutes, guards converge on your position.',
            redirect: success => success ? '/success' : '/game'
          }
        ]
      }
    ]
  }
];

// Template function to create new HTML files
function createOutcomePage(sourcePath, pageConfig) {
  try {
    // Read the source HTML file
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Create outcome page content by modifying source content
    let outcomeContent = sourceContent;
    
    // Replace title and description
    outcomeContent = outcomeContent.replace(
      'title>Dystopian Escape</title',
      `title>Dystopian Escape - ${pageConfig.title}</title`
    );
    
    // Find the border encounter function to replace
    const encounterFuncStart = outcomeContent.indexOf('function triggerBorderEncounter()');
    if (encounterFuncStart === -1) {
      throw new Error(`Could not find triggerBorderEncounter function in ${sourcePath}`);
    }
    
    const encounterFuncEnd = findFunctionEnd(outcomeContent, encounterFuncStart);
    
    // Create the outcome encounter function
    const outcomeEncounterFunc = `
function triggerBorderEncounter() {
    // Prevent multiple trigger
    if (gameProgress.eventInProgress) return;
    gameProgress.eventInProgress = true;

    // Disable player controls during the event
    blocker.style.display = 'none';
    
    // Create border checkpoint UI
    const encounterContainer = document.createElement('div');
    encounterContainer.id = 'border-encounter';
    
    // Set styles
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
    
    // Prepare content
    const content = document.createDocumentFragment();
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = '${pageConfig.title}';
    title.style.marginBottom = '20px';
    content.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.innerHTML = '${pageConfig.description}';
    description.style.marginBottom = '30px';
    description.style.lineHeight = '1.5';
    content.appendChild(description);
    
    // Create options
    const optionsContainer = document.createElement('div');
    Object.assign(optionsContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    });
    
    // Add choice options with different colors
    ${pageConfig.options.map((option, index) => {
      const colors = ['#445577', '#557755', '#775544'];
      return `
    // Option ${index + 1}: ${option.text}
    const option${index + 1} = document.createElement('button');
    option${index + 1}.textContent = '${option.text}';
    Object.assign(option${index + 1}.style, {
        padding: '15px 20px',
        backgroundColor: '${colors[index % 3]}',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    });
    ${option.requiresItem ? `
    // Check if required item is in inventory
    const hasRequiredItem = window.playerInventory && window.playerInventory.hasItem('${option.requiresItem}');
    if (!hasRequiredItem) {
        option${index + 1}.disabled = true;
        option${index + 1}.style.backgroundColor = '#555555';
        option${index + 1}.style.cursor = 'not-allowed';
        option${index + 1}.textContent += ' (Requires ${option.requiresItem})';
    }` : ''}
    option${index + 1}.addEventListener('click', function() {
        // Determine outcome based on probability
        const success = Math.random() < ${option.success};
        
        // Show outcome popup
        showOutcomePopup(
            success, 
            '${option.successOutcome}', 
            '${option.failureOutcome}', 
            '${option.redirect(true)}', 
            '${option.redirect(false)}'
        );
        
        // Remove encounter UI
        encounterContainer.style.opacity = '0';
        setTimeout(() => encounterContainer.remove(), 300);
    });
    optionsContainer.appendChild(option${index + 1});`;
    }).join('\n')}
    
    // Add options to content
    content.appendChild(optionsContainer);
    
    // Add all content at once
    encounterContainer.appendChild(content);
    document.body.appendChild(encounterContainer);
    
    // Force a reflow and fade in
    setTimeout(() => {
        encounterContainer.style.opacity = '1';
    }, 10);
}

// Function to show outcome popup
function showOutcomePopup(success, successText, failureText, successRedirect, failureRedirect) {
    // Create outcome popup
    const outcomeContainer = document.createElement('div');
    outcomeContainer.id = 'outcome-popup';
    
    // Set styles for the container
    Object.assign(outcomeContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: '10000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: '0',
        transition: 'opacity 0.5s ease-in-out'
    });
    
    // Create popup content
    const popupContent = document.createElement('div');
    Object.assign(popupContent.style, {
        backgroundColor: success ? 'rgba(20, 40, 20, 0.95)' : 'rgba(40, 20, 20, 0.95)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '80%',
        border: '2px solid ' + (success ? '#73ff73' : '#ff7373'),
        boxShadow: '0 0 20px ' + (success ? '#73ff73' : '#ff7373')
    });
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = success ? 'Success!' : 'Failure!';
    title.style.color = success ? '#73ff73' : '#ff7373';
    title.style.marginBottom = '20px';
    
    // Add outcome text
    const outcomeText = document.createElement('p');
    outcomeText.textContent = success ? successText : failureText;
    outcomeText.style.marginBottom = '25px';
    outcomeText.style.lineHeight = '1.5';
    
    // Add continue button
    const continueButton = document.createElement('button');
    continueButton.textContent = success ? 'Continue' : 'Try Again';
    Object.assign(continueButton.style, {
        padding: '12px 20px',
        backgroundColor: success ? '#3b6c4a' : '#6c3b3b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'block',
        margin: '0 auto'
    });
    
    // Add click event
    continueButton.addEventListener('click', function() {
        // Redirect to appropriate page
        window.location.href = success ? successRedirect : failureRedirect;
    });
    
    // Assemble the popup
    popupContent.appendChild(title);
    popupContent.appendChild(outcomeText);
    popupContent.appendChild(continueButton);
    outcomeContainer.appendChild(popupContent);
    
    // Add to document
    document.body.appendChild(outcomeContainer);
    
    // Fade in
    setTimeout(() => {
        outcomeContainer.style.opacity = '1';
    }, 50);
}
`;
    
    // Replace the original encounter function with our outcome encounter function
    outcomeContent = outcomeContent.substring(0, encounterFuncStart) + 
                     outcomeEncounterFunc + 
                     outcomeContent.substring(encounterFuncEnd);
    
    // Write the outcome page
    fs.writeFileSync(pageConfig.name, outcomeContent);
    console.log(`Created ${pageConfig.name} successfully`);
    
    return true;
  } catch (error) {
    console.error(`Error creating ${pageConfig.name}:`, error);
    return false;
  }
}

// Helper function to find the end of a function
function findFunctionEnd(content, funcStart) {
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';
  let index = content.indexOf('{', funcStart);
  
  bracketCount = 1; // First opening bracket found
  
  while (bracketCount > 0 && index < content.length) {
    index++;
    
    // Skip string contents
    if ((content[index] === '"' || content[index] === "'") && 
        (index === 0 || content[index-1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = content[index];
      } else if (content[index] === stringChar) {
        inString = false;
      }
    }
    
    if (!inString) {
      if (content[index] === '{') {
        bracketCount++;
      } else if (content[index] === '}') {
        bracketCount--;
      }
    }
  }
  
  return index + 1; // Include the closing bracket
}

// Main function to create all outcome pages
function createAllOutcomePages() {
  console.log('Creating outcome pages...');
  
  // Process each source path and its destinations
  outcomes.forEach(outcome => {
    if (!fs.existsSync(outcome.sourcePath)) {
      console.error(`Source file ${outcome.sourcePath} not found`);
      return;
    }
    
    // Create each destination page for this source
    outcome.destinations.forEach(destination => {
      createOutcomePage(outcome.sourcePath, destination);
    });
  });
  
  console.log('Finished creating outcome pages');
}

// Run the main function
createAllOutcomePages(); 