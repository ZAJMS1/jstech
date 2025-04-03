import { state } from '../core/state.js';

export function initInventory() {
    if (state.inventory.initialized) return;
    
    setupInventoryGrid();
    addInitialItems();
    state.inventory.initialized = true;
}

export function toggleInventory() {
    state.inventory.isOpen = !state.inventory.isOpen;
    const panel = document.getElementById('inventory-panel');
    panel.style.display = state.inventory.isOpen ? 'block' : 'none';
    
    if (state.inventory.isOpen) {
        updateInventoryDisplay();
    }
}

function setupInventoryGrid() {
    // ...inventory grid setup code...
}

function updateInventoryDisplay() {
    // ...inventory display update code...
}
