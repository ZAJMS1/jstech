const fs = require('fs');

try {
    const filePath = 'disguise.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check for the problematic buttons
    const crowbarButtonPattern = /crowbarOption\.textContent = ['"]Befriend a guard for inside help['"];/;
    
    if (crowbarButtonPattern.test(content)) {
        console.log("Found duplicate 'Befriend a guard' button text - fixing it...");
        
        // Replace the crowbar button text
        content = content.replace(
            crowbarButtonPattern,
            "crowbarOption.textContent = 'Use crowbar to break into service tunnels';"
        );
        
        // Also update its color
        const crowbarStylePattern = /Object\.assign\(crowbarOption\.style, \{[\s\S]*?backgroundColor: ['"]#[0-9a-f]{6}['"]/;
        content = content.replace(
            crowbarStylePattern,
            "Object.assign(crowbarOption.style, {\n                            padding: '15px 20px',\n                            backgroundColor: '#775555'"
        );
        
        // Fix sneakOption text and color if needed
        const sneakButtonPattern = /sneakOption\.textContent = ['"][^'"]*['"];/;
        const sneakMatch = content.match(sneakButtonPattern);
        
        if (sneakMatch && !sneakMatch[0].includes("Create a distraction with staged accident")) {
            console.log("Fixing sneakOption text...");
            content = content.replace(
                sneakButtonPattern,
                "sneakOption.textContent = 'Create a distraction with staged accident';"
            );
            
            // Also update its color
            const sneakStylePattern = /Object\.assign\(sneakOption\.style, \{[\s\S]*?backgroundColor: ['"]#[0-9a-f]{6}['"]/;
            content = content.replace(
                sneakStylePattern,
                "Object.assign(sneakOption.style, {\n                        padding: '15px 20px',\n                        backgroundColor: '#997755'"
            );
        }
        
        // Check for a disguiseOption
        const disguiseButtonPattern = /disguiseOption\.textContent = ['"][^'"]*['"];/;
        const disguiseMatch = content.match(disguiseButtonPattern);
        
        if (disguiseMatch && !disguiseMatch[0].includes("Bluff through checkpoint with forged papers")) {
            console.log("Fixing disguiseOption text...");
            content = content.replace(
                disguiseButtonPattern,
                "disguiseOption.textContent = 'Bluff through checkpoint with forged papers';"
            );
            
            // Also update its color
            const disguiseStylePattern = /Object\.assign\(disguiseOption\.style, \{[\s\S]*?backgroundColor: ['"]#[0-9a-f]{6}['"]/;
            if (disguiseStylePattern.test(content)) {
                content = content.replace(
                    disguiseStylePattern,
                    "Object.assign(disguiseOption.style, {\n                        padding: '15px 20px',\n                        backgroundColor: '#775599'"
                );
            }
        }
        
        // Write the changes back to the file
        fs.writeFileSync(filePath, content);
        console.log("Successfully updated the disguise page button text and colors!");
    } else {
        console.log("No duplicate button text found - checking if any button text needs to be fixed...");
        
        let modified = false;
        
        // Fix sneakOption if it's not the right text
        const sneakButtonPattern = /sneakOption\.textContent = ['"][^'"]*['"];/;
        const sneakMatch = content.match(sneakButtonPattern);
        
        if (sneakMatch && !sneakMatch[0].includes("Create a distraction with staged accident")) {
            console.log("Fixing sneakOption text...");
            content = content.replace(
                sneakButtonPattern,
                "sneakOption.textContent = 'Create a distraction with staged accident';"
            );
            modified = true;
        }
        
        // Fix crowbarOption if it exists but has wrong text
        const crowbarButtonPattern = /crowbarOption\.textContent = ['"][^'"]*['"];/;
        const crowbarMatch = content.match(crowbarButtonPattern);
        
        if (crowbarMatch && !crowbarMatch[0].includes("Use crowbar to break into service tunnels")) {
            console.log("Fixing crowbarOption text...");
            content = content.replace(
                crowbarButtonPattern,
                "crowbarOption.textContent = 'Use crowbar to break into service tunnels';"
            );
            modified = true;
        }
        
        if (modified) {
            // Write the changes back to the file
            fs.writeFileSync(filePath, content);
            console.log("Successfully updated the button text on the disguise page!");
        } else {
            console.log("All button text appears to be correct.");
        }
    }
} catch (error) {
    console.error("Error fixing the disguise page:", error);
} 