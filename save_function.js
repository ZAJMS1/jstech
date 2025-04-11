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
