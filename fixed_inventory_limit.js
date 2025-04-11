const fs = require('fs');

try {
    const filePath = 'alternative.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the inventory system initialization
    const inventorySystemIndex = content.indexOf('function initInventorySystem()');
    if (inventorySystemIndex === -1) {
        throw new Error('Could not find inventory system initialization');
    }
    
    // Find the addItem function in the inventory system
    const addItemIndex = content.indexOf('addItem: function(name, description)', inventorySystemIndex);
    if (addItemIndex === -1) {
        throw new Error('Could not find addItem function');
    }
    
    // Find the end of the function
    const addItemEndIndex = content.indexOf('},', addItemIndex);
    if (addItemEndIndex === -1) {
        throw new Error('Could not find end of addItem function');
    }
    
    // Get the original addItem function
    const originalAddItem = content.substring(addItemIndex, addItemEndIndex + 2);
    
    // Create improved addItem function with item limit and drop functionality
    const improvedAddItem = `addItem: function(name, description) {
                            // Check if item already exists to prevent duplicates
                            if (!this.hasItem(name)) {
                                // Check if inventory is at capacity (3 items)
                                const activeItems = this.items.filter(item => !item.used);
                                if (activeItems.length >= 3) {
                                    // Inventory full - show item limit popup
                                    this.showItemLimitPopup(name, description);
                                    return false;
                                }
                                
                                // Add item as normal
                                this.items.push({
                                    name: name,
                                    description: description,
                                    used: false
                                });
                                this.saveInventory();
                                this.updateUI();
                                return true;
                            }
                            return false;
                        },
                        
                        showItemLimitPopup: function(newItemName, newItemDescription) {
                            // Create item limit popup
                            const inventoryLimitContainer = document.createElement('div');
                            inventoryLimitContainer.id = 'inventory-limit-popup';
                            
                            // Set styles for the container
                            Object.assign(inventoryLimitContainer.style, {
                                position: 'fixed',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                zIndex: '10000',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            });
                            
                            // Create popup content
                            const popupContent = document.createElement('div');
                            Object.assign(popupContent.style, {
                                backgroundColor: 'rgba(20, 20, 40, 0.95)',
                                color: 'white',
                                padding: '30px',
                                borderRadius: '10px',
                                maxWidth: '500px',
                                width: '80%',
                                border: '2px solid #73a1ff',
                                boxShadow: '0 0 20px #73a1ff'
                            });
                            
                            // Add title and description
                            const title = document.createElement('h2');
                            title.textContent = 'Inventory Full';
                            title.style.color = '#73a1ff';
                            title.style.marginBottom = '15px';
                            
                            const description = document.createElement('p');
                            description.textContent = 'You found: ' + newItemName + ' - ' + newItemDescription;
                            description.style.marginBottom = '15px';
                            
                            const limitText = document.createElement('p');
                            limitText.textContent = 'Your inventory is full (maximum 3 items). You can either leave this item behind or drop something else to make room.';
                            limitText.style.marginBottom = '25px';
                            
                            // Create item list for dropping
                            const itemListContainer = document.createElement('div');
                            itemListContainer.style.marginBottom = '20px';
                            
                            const itemListTitle = document.createElement('h3');
                            itemListTitle.textContent = 'Choose an item to drop:';
                            itemListTitle.style.marginBottom = '10px';
                            
                            const itemList = document.createElement('div');
                            itemList.style.display = 'flex';
                            itemList.style.flexDirection = 'column';
                            itemList.style.gap = '10px';
                            
                            // Get active items
                            const activeItems = this.items.filter(item => !item.used);
                            
                            // Add each item as a button
                            activeItems.forEach((item, index) => {
                                const itemButton = document.createElement('button');
                                itemButton.textContent = item.name + ' - ' + item.description;
                                Object.assign(itemButton.style, {
                                    padding: '10px',
                                    backgroundColor: '#3b546c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                });
                                
                                // Add hover effect
                                itemButton.addEventListener('mouseover', function() {
                                    this.style.backgroundColor = '#4c6580';
                                });
                                itemButton.addEventListener('mouseout', function() {
                                    this.style.backgroundColor = '#3b546c';
                                });
                                
                                // Add click event to drop this item and pick up the new one
                                itemButton.addEventListener('click', () => {
                                    // Mark this item as dropped/used
                                    this.items[this.items.indexOf(item)].used = true;
                                    
                                    // Add the new item
                                    this.items.push({
                                        name: newItemName,
                                        description: newItemDescription,
                                        used: false
                                    });
                                    
                                    // Save inventory and update UI
                                    this.saveInventory();
                                    this.updateUI();
                                    
                                    // Close popup
                                    inventoryLimitContainer.remove();
                                });
                                
                                itemList.appendChild(itemButton);
                            });
                            
                            // Add "Leave it" button
                            const buttonContainer = document.createElement('div');
                            buttonContainer.style.display = 'flex';
                            buttonContainer.style.justifyContent = 'space-between';
                            buttonContainer.style.marginTop = '20px';
                            
                            const leaveButton = document.createElement('button');
                            leaveButton.textContent = 'Leave ' + newItemName;
                            Object.assign(leaveButton.style, {
                                padding: '12px 20px',
                                backgroundColor: '#6c3b3b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                flex: '1',
                                marginRight: '10px'
                            });
                            leaveButton.addEventListener('click', () => {
                                inventoryLimitContainer.remove();
                            });
                            
                            // Assemble the popup
                            itemListContainer.appendChild(itemListTitle);
                            itemListContainer.appendChild(itemList);
                            
                            popupContent.appendChild(title);
                            popupContent.appendChild(description);
                            popupContent.appendChild(limitText);
                            popupContent.appendChild(itemListContainer);
                            
                            buttonContainer.appendChild(leaveButton);
                            popupContent.appendChild(buttonContainer);
                            
                            inventoryLimitContainer.appendChild(popupContent);
                            document.body.appendChild(inventoryLimitContainer);
                        },`;
                        
    // Replace the original addItem function with the improved one
    content = content.replace(originalAddItem, improvedAddItem);
    
    // Now update the updateUI function to show item count
    const updateUIIndex = content.indexOf('updateUI: function()', inventorySystemIndex);
    if (updateUIIndex !== -1) {
        // Find where the HTML is generated for the inventory title
        const updateHtmlIndex = content.indexOf("itemsHtml += '<h3 style=\"margin-top:0\">Inventory</h3>';", updateUIIndex);
        
        if (updateHtmlIndex !== -1) {
            // Replace the title with one that shows the count
            content = content.replace(
                "itemsHtml += '<h3 style=\"margin-top:0\">Inventory</h3>';",
                "itemsHtml += '<h3 style=\"margin-top:0\">Inventory (' + this.items.filter(item => !item.used).length + '/3)</h3>';"
            );
        }
    }
    
    // Write the changes back to the file
    fs.writeFileSync(filePath, content);
    console.log('Successfully added 3-item inventory limit system to alternative.html');
    
} catch (error) {
    console.error('Error adding inventory limit system:', error);
} 