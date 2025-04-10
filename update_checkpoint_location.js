// Script to update the border checkpoint location from z=80 to z=110
const fs = require('fs');

const files = ['sneak.html', 'alternative.html', 'disguise.html'];

files.forEach(file => {
  try {
    console.log(`Updating border checkpoint location in ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Find and replace the checkpoint z-coordinate 
    const borderCheckpointPattern = /(const borderCheckpoint = \{\s+x: 0,\s+\/\/ Center x-coordinate\s+z: )80(,\s+\/\/ Changed from 120 to trigger event earlier)/;
    
    if (content.match(borderCheckpointPattern)) {
      content = content.replace(borderCheckpointPattern, '$1110$2');
      console.log(`Changed border checkpoint z-coordinate from 80 to 110 in ${file}`);
    } else {
      console.log(`Could not find border checkpoint definition in ${file}`);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated ${file}`);
  } catch (error) {
    console.error(`Error updating ${file}:`, error);
  }
});

console.log('Finished updating border checkpoint location in all files.'); 