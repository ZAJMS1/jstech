const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

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

// Start the server
app.listen(port, () => {
  console.log(`Dystopia Escape server running at http://localhost:${port}`);
}); 