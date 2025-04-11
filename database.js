const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Connect to SQLite database (creates it if it doesn't exist)
const db = new sqlite3.Database(path.join(dbDir, 'gamedata.db'));

// Initialize database tables
function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create saved_games table
            db.run(`CREATE TABLE IF NOT EXISTS saved_games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL, 
                current_page TEXT NOT NULL,
                position_x REAL,
                position_y REAL,
                position_z REAL,
                camera_rotation_x REAL,
                camera_rotation_y REAL,
                game_progress TEXT,
                inventory_items TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating saved_games table:', err);
                    reject(err);
                } else {
                    console.log('Database tables initialized');
                    resolve();
                }
            });
        });
    });
}

// Save game state to database
function saveGame(userId, gameData) {
    return new Promise((resolve, reject) => {
        if (!userId) {
            console.error('Invalid userId provided to saveGame');
            return reject(new Error('Invalid userId'));
        }
        
        if (!gameData || !gameData.currentPage) {
            console.error('Invalid gameData provided to saveGame:', gameData);
            return reject(new Error('Invalid game data'));
        }
        
        console.log(`Attempting to save game for user ${userId}`);
        
        // First check if user already has a saved game
        db.get('SELECT id FROM saved_games WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error checking for existing save:', err);
                reject(err);
                return;
            }
            
            const {
                currentPage, 
                position,
                cameraRotation,
                gameProgress,
                inventoryItems
            } = gameData;
            
            // Ensure all required values are present
            if (!position || typeof position.x !== 'number' || 
                typeof position.y !== 'number' || 
                typeof position.z !== 'number') {
                console.error('Invalid position data:', position);
                return reject(new Error('Invalid position data'));
            }
            
            if (!cameraRotation || typeof cameraRotation.x !== 'number' || 
                typeof cameraRotation.y !== 'number') {
                console.error('Invalid camera rotation data:', cameraRotation);
                return reject(new Error('Invalid camera rotation data'));
            }
            
            // Convert objects to JSON strings for storage
            let gameProgressJson, inventoryItemsJson;
            
            try {
                gameProgressJson = JSON.stringify(gameProgress || {});
                inventoryItemsJson = JSON.stringify(inventoryItems || []);
            } catch (jsonError) {
                console.error('Error stringifying game data:', jsonError);
                return reject(new Error('Failed to serialize game data'));
            }
            
            if (row) {
                // Update existing save
                console.log(`Updating existing save for user ${userId}`);
                
                db.run(
                    `UPDATE saved_games SET 
                    current_page = ?,
                    position_x = ?,
                    position_y = ?,
                    position_z = ?,
                    camera_rotation_x = ?,
                    camera_rotation_y = ?,
                    game_progress = ?,
                    inventory_items = ?,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = ?`,
                    [
                        currentPage,
                        position.x,
                        position.y,
                        position.z,
                        cameraRotation.x,
                        cameraRotation.y,
                        gameProgressJson,
                        inventoryItemsJson,
                        userId
                    ],
                    function(err) {
                        if (err) {
                            console.error('Error updating save game:', err);
                            reject(err);
                        } else {
                            console.log(`Updated save game for user ${userId}`);
                            resolve(this.lastID);
                        }
                    }
                );
            } else {
                // Create new save
                console.log(`Creating new save for user ${userId}`);
                
                db.run(
                    `INSERT INTO saved_games 
                    (user_id, current_page, position_x, position_y, position_z, 
                    camera_rotation_x, camera_rotation_y, game_progress, inventory_items)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId,
                        currentPage,
                        position.x,
                        position.y,
                        position.z,
                        cameraRotation.x,
                        cameraRotation.y,
                        gameProgressJson,
                        inventoryItemsJson
                    ],
                    function(err) {
                        if (err) {
                            console.error('Error creating save game:', err);
                            reject(err);
                        } else {
                            console.log(`Created new save game for user ${userId}`);
                            resolve(this.lastID);
                        }
                    }
                );
            }
        });
    });
}

// Load game state from database
function loadGame(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM saved_games WHERE user_id = ?`,
            [userId],
            (err, row) => {
                if (err) {
                    console.error('Error loading save game:', err);
                    reject(err);
                } else if (!row) {
                    // No saved game found
                    resolve(null);
                } else {
                    // Parse JSON strings back to objects
                    try {
                        const gameProgress = JSON.parse(row.game_progress || '{}');
                        const inventoryItems = JSON.parse(row.inventory_items || '[]');
                        
                        // Format data for client
                        const saveData = {
                            currentPage: row.current_page,
                            position: {
                                x: row.position_x,
                                y: row.position_y,
                                z: row.position_z
                            },
                            cameraRotation: {
                                x: row.camera_rotation_x,
                                y: row.camera_rotation_y
                            },
                            gameProgress,
                            inventoryItems
                        };
                        
                        resolve(saveData);
                    } catch (error) {
                        console.error('Error parsing saved game data:', error);
                        reject(error);
                    }
                }
            }
        );
    });
}

// Delete saved game
function deleteSave(userId) {
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM saved_games WHERE user_id = ?',
            [userId],
            function(err) {
                if (err) {
                    console.error('Error deleting save game:', err);
                    reject(err);
                } else {
                    console.log(`Deleted save game for user ${userId}`);
                    resolve(this.changes);
                }
            }
        );
    });
}

// Check if user has a saved game
function hasSavedGame(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id FROM saved_games WHERE user_id = ?',
            [userId],
            (err, row) => {
                if (err) {
                    console.error('Error checking saved game:', err);
                    reject(err);
                } else {
                    resolve(!!row);
                }
            }
        );
    });
}

module.exports = {
    initDatabase,
    saveGame,
    loadGame,
    deleteSave,
    hasSavedGame
}; 