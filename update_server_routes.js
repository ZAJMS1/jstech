const fs = require('fs');

// List of new routes to add
const newRoutes = [
  { path: '/checkpoint', file: 'checkpoint.html' },
  { path: '/accident', file: 'accident.html' },
  { path: '/guard', file: 'guard.html' },
  { path: '/shadows', file: 'shadows.html' },
  { path: '/uniforms', file: 'uniforms.html' },
  { path: '/cameras', file: 'cameras.html' },
  { path: '/tunnels', file: 'tunnels.html' },
  { path: '/truck', file: 'truck.html' },
  { path: '/fence', file: 'fence.html' }
];

try {
  // Read the server.js file
  const serverJsPath = 'server.js';
  let serverJsContent = fs.readFileSync(serverJsPath, 'utf8');
  
  // Find where to insert the new routes - before the server start line
  const serverStartIndex = serverJsContent.indexOf('// Start the server');
  
  if (serverStartIndex === -1) {
    throw new Error('Could not find server start comment in server.js');
  }
  
  // Create route handling code for each new route
  const newRouteHandlers = newRoutes.map(route => `
app.get('${route.path}', (req, res) => {
  res.sendFile(path.join(__dirname, '${route.file}'));
});`).join('');
  
  // Insert the new routes before the server start line
  const updatedServerJsContent = 
    serverJsContent.substring(0, serverStartIndex) + 
    '\n// New outcome page routes' + 
    newRouteHandlers + 
    '\n\n' + 
    serverJsContent.substring(serverStartIndex);
  
  // Write the updated content back to server.js
  fs.writeFileSync(serverJsPath, updatedServerJsContent);
  
  console.log('Successfully added new routes to server.js:');
  newRoutes.forEach(route => {
    console.log(`- ${route.path} -> ${route.file}`);
  });
  
} catch (error) {
  console.error('Error updating server.js:', error);
} 