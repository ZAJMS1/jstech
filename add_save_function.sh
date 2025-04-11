#!/bin/bash

# Get all HTML files except index.html, success.html and inside node_modules
HTML_FILES=$(find . -name "*.html" -not -name "index.html" -not -name "success.html" -not -path "./node_modules/*")

# Function to add to the end of the file (before the final closing tags)
cat > save_function.js << 'EOL'
// Save game and quit function
function saveGameAndQuit() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop();
    
    try {
        // Create game data to save
        const gameData = {
            currentPage,
            position: {
                x: player.position.x,
                y: player.position.y,
                z: player.position.z
            },
            cameraRotation: {
                x: state.cameraRotation.x,
                y: state.cameraRotation.y
            },
            // Ensure gameProgress is an object
            gameProgress: (typeof gameProgress === 'object' && gameProgress !== null) 
                ? gameProgress 
                : {
                    hasBackpack: false,
                    storyPhase: 'intro',
                    checkpointTriggered: false,
                    borderReached: false
                },
            inventoryItems: state.inventory.items || []
        };
        
        // Call API to save game
        fetch('/api/save-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Game saved successfully');
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                console.error('Failed to save game:', data.error);
                alert('Failed to save game: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error saving game:', error);
            alert('Error saving game. Please try again.');
        });
    } catch (err) {
        console.error('Exception in saveGameAndQuit:', err);
        alert('Error preparing save data: ' + err.message);
    }
}
EOL

# Process each HTML file
for file in $HTML_FILES; do
    echo "Processing $file"
    
    # Check if saveGameAndQuit function already exists
    if grep -q "function saveGameAndQuit" "$file"; then
        echo "  saveGameAndQuit function already exists in $file"
    else
        # Add saveGameAndQuit function to the file right before the last catch-block
        sed -i '' '$ i\\
        // Save game and quit function\
        function saveGameAndQuit() {\
            // Get current page URL\
            const currentPage = window.location.pathname.split("/").pop();\
            \
            try {\
                // Create game data to save\
                const gameData = {\
                    currentPage,\
                    position: {\
                        x: player.position.x,\
                        y: player.position.y,\
                        z: player.position.z\
                    },\
                    cameraRotation: {\
                        x: state.cameraRotation.x,\
                        y: state.cameraRotation.y\
                    },\
                    // Ensure gameProgress is an object\
                    gameProgress: (typeof gameProgress === "object" && gameProgress !== null) \
                        ? gameProgress \
                        : {\
                            hasBackpack: false,\
                            storyPhase: "intro",\
                            checkpointTriggered: false,\
                            borderReached: false\
                        },\
                    inventoryItems: state.inventory.items || []\
                };\
                \
                // Call API to save game\
                fetch("/api/save-game", {\
                    method: "POST",\
                    headers: {\
                        "Content-Type": "application/json"\
                    },\
                    body: JSON.stringify(gameData)\
                })\
                .then(response => {\
                    if (!response.ok) {\
                        throw new Error(`Server responded with status: ${response.status}`);\
                    }\
                    return response.json();\
                })\
                .then(data => {\
                    if (data.success) {\
                        console.log("Game saved successfully");\
                        // Redirect to home page\
                        window.location.href = "index.html";\
                    } else {\
                        console.error("Failed to save game:", data.error);\
                        alert("Failed to save game: " + (data.error || "Unknown error"));\
                    }\
                })\
                .catch(error => {\
                    console.error("Error saving game:", error);\
                    alert("Error saving game. Please try again.");\
                });\
            } catch (err) {\
                console.error("Exception in saveGameAndQuit:", err);\
                alert("Error preparing save data: " + err.message);\
            }\
        }\
        ' "$file"
        echo "  Added saveGameAndQuit function to $file"
    fi
    
    # Check if the save-quit event listener exists
    if grep -q "getElementById.*save-quit" "$file"; then
        echo "  save-quit event listener already exists in $file"
    else
        # Find line with restart-game event listener and add save-quit after it
        listener_line=$(grep -n "getElementById.*restart-game" "$file" | head -1 | cut -d':' -f1)
        if [ ! -z "$listener_line" ]; then
            # Add 3 to get to the end of the listener block
            insert_line=$((listener_line + 3))
            sed -i '' "${insert_line}i\\
                    document.getElementById(\"save-quit\").addEventListener(\"click\", function() {\\
                        saveGameAndQuit();\\
                    });\\
            " "$file"
            echo "  Added save-quit event listener to $file"
        else
            echo "  Could not find restart-game listener in $file"
        fi
    fi
    
    echo "Completed processing $file"
done

echo "All files processed!" 