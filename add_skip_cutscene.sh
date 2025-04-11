#!/bin/bash

# Get all HTML files except index.html and success.html
HTML_FILES=$(find . -name "*.html" -not -name "index.html" -not -name "success.html" -not -path "./node_modules/*")

for file in $HTML_FILES; do
    echo "Processing $file"
    
    # First, add code to the startIntroCutscene function
    # Insert skip logic after the function declaration
    sed -i '' '/function startIntroCutscene()/a\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ // Skip cutscene if player is continuing from a save and not at spawn position\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ if (savedPosition \\&\\& \\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ console.log("Player continuing from save - skipping intro cutscene");\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ return; // Skip the cutscene entirely\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ }\\
    ' "$file"
    
    # Now add code to the checkStoryProgress function to skip popups
    sed -i '' '/function checkStoryProgress(/,/position/s/position)/position)\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ {\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ // Skip triggers if player loaded from a save and is already away from spawn\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ if (savedPosition \\&\\& \\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ (Math.abs(position.x) > 5 || Math.abs(position.z) > 5)) {\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ gameProgress.borderReached = true; // Prevent border trigger\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ console.log("Player continuing from save - skipping story triggers");\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ return;\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ }/' "$file"
    
    # Add code to triggerBorderEncounter to skip for continued games
    sed -i '' '/function triggerBorderEncounter()/a\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ // Skip for continued games\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ if (savedPosition \\&\\& \\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ (Math.abs(savedPosition.x) > 5 || Math.abs(savedPosition.z) > 5)) {\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ console.log("Player continuing from save - skipping border encounter");\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ return;\\
    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ }\\
    ' "$file"
    
    echo "Completed processing $file"
done

echo "All files processed!" 