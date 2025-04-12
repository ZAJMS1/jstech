const fs = require('fs');
const path = require('path');

const fencePath = path.join(__dirname, 'fence.html');

// Read the file
fs.readFile(fencePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Find the DOMContentLoaded event handler that contains the knife prompt
    const domContentLoadedRegex = /document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 500\);/;

    // Replace 500 with 3600000 (1 hour in milliseconds)
    const updatedContent = data.replace(
        domContentLoadedRegex,
        match => match.replace(/setTimeout\(\(\) => \{/, 'setTimeout(() => {')
                             .replace(/\}, 500\);/, '}, 3600000);')
    );

    // Write the changes back to the file
    fs.writeFile(fencePath, updatedContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Successfully updated fence.html');
    });
});
