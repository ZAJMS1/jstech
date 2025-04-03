import * as THREE from 'three';
import { state } from '../core/state.js';

export function createCharacterModel() {
    const character = new THREE.Group();
    
    // Create character mesh components
    const body = createBody();
    const head = createHead();
    const arms = createArms();
    const legs = createLegs();
    
    // Add components to character
    character.add(body);
    character.add(head);
    character.add(arms);
    character.add(legs);
    
    return character;
}

function createBody() {
    // ...existing body creation code...
}

function createHead() {
    // ...existing head creation code...
}

function createArms() {
    // ...existing arms creation code...
}

function createLegs() {
    // ...existing legs creation code...
}
