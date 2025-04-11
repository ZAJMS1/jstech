const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

// Import database functions
const { 
    initDatabase, 
    saveGame, 
    loadGame, 
    deleteSave, 
    hasSavedGame 
} = require('./database');

// Initialize database
initDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'dystopian-escape-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Create user ID if one doesn't exist
app.use((req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = uuidv4();
    }
    next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Specific routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

app.get('/sneak', (req, res) => {
    res.sendFile(path.join(__dirname, 'sneak.html'));
});

app.get('/alternative', (req, res) => {
    res.sendFile(path.join(__dirname, 'alternative.html'));
});

app.get('/disguise', (req, res) => {
    res.sendFile(path.join(__dirname, 'disguise.html'));
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// New outcome page routes
app.get('/checkpoint', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkpoint.html'));
});
app.get('/accident', (req, res) => {
    res.sendFile(path.join(__dirname, 'accident.html'));
});
app.get('/guard', (req, res) => {
    res.sendFile(path.join(__dirname, 'guard.html'));
});
app.get('/shadows', (req, res) => {
    res.sendFile(path.join(__dirname, 'shadows.html'));
});
app.get('/uniforms', (req, res) => {
    res.sendFile(path.join(__dirname, 'uniforms.html'));
});
app.get('/cameras', (req, res) => {
    res.sendFile(path.join(__dirname, 'cameras.html'));
});
app.get('/tunnels', (req, res) => {
    res.sendFile(path.join(__dirname, 'tunnels.html'));
});
app.get('/truck', (req, res) => {
    res.sendFile(path.join(__dirname, 'truck.html'));
});
app.get('/fence', (req, res) => {
    res.sendFile(path.join(__dirname, 'fence.html'));
});

// API route to check if user has a saved game
app.get('/api/save-exists', async (req, res) => {
    try {
        const userId = req.session.userId;
        const hasSave = await hasSavedGame(userId);
        res.json({ hasSave });
    } catch (error) {
        console.error('Error checking saved game:', error);
        res.status(500).json({ error: 'Failed to check save game status' });
    }
});

// API route to save game
app.post('/api/save-game', async (req, res) => {
    try {
        const userId = req.session.userId;
        const gameData = req.body;
        
        console.log('Received save request from user:', userId);
        console.log('Game data:', JSON.stringify(gameData).substring(0, 200) + '...');
        
        // Validate required fields
        if (!gameData.currentPage) {
            throw new Error('Missing required field: currentPage');
        }
        if (!gameData.position || typeof gameData.position.x === 'undefined') {
            throw new Error('Missing or invalid position data');
        }
        
        // Ensure gameProgress and inventoryItems exist
        gameData.gameProgress = gameData.gameProgress || {};
        gameData.inventoryItems = gameData.inventoryItems || [];
        
        await saveGame(userId, gameData);
        console.log('Game saved successfully for user:', userId);
        res.json({ success: true, message: 'Game saved successfully' });
    } catch (error) {
        console.error('Error saving game:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: error.message || 'Failed to save game' });
    }
});

// API route to load game
app.get('/api/load-game', async (req, res) => {
    try {
        const userId = req.session.userId;
        const saveData = await loadGame(userId);
        
        if (!saveData) {
            res.status(404).json({ error: 'No saved game found' });
        } else {
            res.json({ success: true, saveData });
        }
    } catch (error) {
        console.error('Error loading game:', error);
        res.status(500).json({ error: 'Failed to load game' });
    }
});

// API route to delete saved game
app.delete('/api/delete-save', async (req, res) => {
    try {
        const userId = req.session.userId;
        await deleteSave(userId);
        res.json({ success: true, message: 'Save data deleted successfully' });
    } catch (error) {
        console.error('Error deleting saved game:', error);
        res.status(500).json({ error: 'Failed to delete save data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Dystopia Escape server running at http://localhost:${port}`);
}); 