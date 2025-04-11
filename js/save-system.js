// Game save system for Dystopian Escape
// Handles game state saving and loading

// Save game to server
function saveGame(gameData) {
    return new Promise((resolve, reject) => {
        fetch('/api/save-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Error saving game');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Game saved successfully:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Save error:', error);
            reject(error);
        });
    });
}

// Load game from server
function loadGame() {
    return new Promise((resolve, reject) => {
        fetch('/api/load-game')
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Error loading game');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Game loaded successfully:', data);
            resolve(data.saveData);
        })
        .catch(error => {
            console.error('Load error:', error);
            reject(error);
        });
    });
}

// Delete saved game
function deleteSave() {
    return new Promise((resolve, reject) => {
        fetch('/api/delete-save', {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Error deleting save');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Save deleted successfully:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Delete error:', error);
            reject(error);
        });
    });
}

// Check if a save exists
function checkSaveExists() {
    return new Promise((resolve, reject) => {
        fetch('/api/save-exists')
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Error checking save');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Save check result:', data);
            resolve(data.hasSave);
        })
        .catch(error => {
            console.error('Save check error:', error);
            reject(error);
        });
    });
}

// Save game and quit to home page
function saveGameAndQuit(gameData) {
    saveGame(gameData)
        .then(() => {
            window.location.href = '/';
        })
        .catch(error => {
            alert('Error saving game: ' + error.message);
        });
}

// Expose functions to global scope
window.saveGame = saveGame;
window.loadGame = loadGame;
window.deleteSave = deleteSave;
window.checkSaveExists = checkSaveExists;
window.saveGameAndQuit = saveGameAndQuit; 